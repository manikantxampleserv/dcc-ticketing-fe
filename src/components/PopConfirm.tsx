import React, { useState, useRef, ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button, Card, Typography, Box } from '@mui/joy';
import { AlertCircle } from 'lucide-react';

export interface PopConfirmProps {
  title?: string;
  description?: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  okText?: string;
  cancelText?: string;
  placement?: 'top' | 'bottom';
  disabled?: boolean;
  children: ReactNode;
}

const PopConfirm: React.FC<PopConfirmProps> = ({
  title = 'Delete the task',
  description = 'Are you sure to delete this task?',
  onConfirm,
  onCancel,
  okText = 'Yes',
  cancelText = 'No',
  placement = 'top',
  disabled = false,
  children
}) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [actualPlacement, setActualPlacement] = useState<'top' | 'bottom'>('top');
  const [arrowOffset, setArrowOffset] = useState(0);
  const anchorRef = useRef<HTMLElement>(null);

  const calculatePosition = () => {
    if (!anchorRef.current) return;

    const rect = anchorRef.current.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    // Popup dimensions (approximate)
    const popupWidth = 300;
    const popupHeight = 120;
    const margin = 16; // Safe margin from screen edges

    let top = 0;
    let left = 0;
    const triggerCenterX = rect.left + scrollLeft + rect.width / 2;

    if (placement === 'top') {
      top = rect.top + scrollTop - 12;
      left = triggerCenterX;
    } else {
      top = rect.bottom + scrollTop + 12;
      left = triggerCenterX;
    }

    // Check horizontal boundaries and adjust
    const viewportWidth = window.innerWidth;
    const leftEdge = left - popupWidth / 2;
    const rightEdge = left + popupWidth / 2;

    let adjustedLeft = left;
    let arrowOffsetValue = 0;

    if (leftEdge < margin) {
      // Too close to left edge
      adjustedLeft = margin + popupWidth / 2;
      arrowOffsetValue = left - adjustedLeft; // How much we shifted
    } else if (rightEdge > viewportWidth - margin) {
      // Too close to right edge
      adjustedLeft = viewportWidth - margin - popupWidth / 2;
      arrowOffsetValue = left - adjustedLeft; // How much we shifted
    }

    left = adjustedLeft;

    // Check vertical boundaries and adjust
    const viewportHeight = window.innerHeight;
    let finalPlacement = placement;

    if (placement === 'top') {
      const topEdge = top - popupHeight;
      if (topEdge < scrollTop + margin) {
        // Not enough space above, switch to bottom
        top = rect.bottom + scrollTop + 12;
        finalPlacement = 'bottom';
      }
    } else {
      const bottomEdge = top + popupHeight;
      if (bottomEdge > scrollTop + viewportHeight - margin) {
        // Not enough space below, switch to top
        top = rect.top + scrollTop - 12;
        finalPlacement = 'top';
      }
    }

    setActualPlacement(finalPlacement);
    setArrowOffset(arrowOffsetValue);
    setPosition({ top, left });
  };

  useEffect(() => {
    if (open) {
      calculatePosition();
      const handleResize = () => calculatePosition();
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleResize);
      };
    }
  }, [open, placement]);

  const handleTriggerClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!disabled) {
      setOpen(!open);
    }
  };

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      onConfirm();
      setOpen(false);
    } catch (error) {
      console.error('Confirmation action failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    onCancel?.();
  };

  const handleClickAway = (event: MouseEvent) => {
    const target = event.target as Node;
    const popupElement = document.querySelector('[data-popup-confirm="true"]');

    if (
      !isLoading &&
      anchorRef.current &&
      !anchorRef.current.contains(target) &&
      popupElement &&
      !popupElement.contains(target)
    ) {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleClickAway);
      return () => document.removeEventListener('mousedown', handleClickAway);
    }
  }, [open, isLoading]);

  return (
    <>
      {React.cloneElement(children as React.ReactElement, {
        ref: anchorRef,
        onClick: handleTriggerClick,
        style: {
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          ...((children as React.ReactElement).props?.style || {})
        }
      })}

      {open &&
        createPortal(
          <Card
            variant="outlined"
            data-popup-confirm="true"
            sx={{
              position: 'absolute',
              top: position.top,
              left: position.left,
              transform: actualPlacement === 'top' ? 'translate(-50%, -100%)' : 'translateX(-50%)',
              minWidth: 280,
              maxWidth: 320,
              p: 2.5,
              boxShadow: 'lg',
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.popup',
              borderRadius: 'md',
              zIndex: 1300,
              animation: 'fadeIn 0.2s ease-out',
              '@keyframes fadeIn': {
                from: {
                  opacity: 0,
                  transform:
                    actualPlacement === 'top' ? 'translate(-50%, -100%) scale(0.95)' : 'translateX(-50%) scale(0.95)'
                },
                to: {
                  opacity: 1,
                  transform: actualPlacement === 'top' ? 'translate(-50%, -100%) scale(1)' : 'translateX(-50%) scale(1)'
                }
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: actualPlacement === 'top' ? -8 : 'unset',
                top: actualPlacement === 'bottom' ? -8 : 'unset',
                left: `calc(50% + ${arrowOffset}px)`,
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: actualPlacement === 'top' ? '8px solid white' : 'none',
                borderBottom: actualPlacement === 'bottom' ? '8px solid white' : 'none',
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <Box sx={{ color: 'warning.500', display: 'flex', alignItems: 'center', mt: 0.5 }}>
                <AlertCircle size={12} />
              </Box>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography level="title-sm" sx={{ fontWeight: 600, mb: 0.5, color: 'text.primary' }}>
                  {title}
                </Typography>

                <Typography level="body-sm" sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.4 }}>
                  {description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    color="neutral"
                    size="sm"
                    onClick={handleCancel}
                    disabled={isLoading}
                    sx={{ minWidth: 60 }}
                  >
                    {cancelText}
                  </Button>

                  <Button
                    variant="solid"
                    color="primary"
                    size="sm"
                    onClick={handleConfirm}
                    loading={isLoading}
                    sx={{ minWidth: 60 }}
                  >
                    {okText}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Card>,
          document.body
        )}
    </>
  );
};

export default PopConfirm;
