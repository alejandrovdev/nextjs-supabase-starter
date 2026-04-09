'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/shadcn/utils';
import { Camera, Trash2, Upload } from 'lucide-react';
import {
  type ChangeEvent,
  forwardRef,
  type InputHTMLAttributes,
  type MouseEvent,
  useEffect,
  useMemo,
  useRef,
} from 'react';

export interface ImageInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange'
> {
  value?: File | string | null;
  onChange?: (file: File | null) => void;
  previewClassName?: string;
  fallbackText?: string;
}

export const ImageInput = forwardRef<HTMLInputElement, ImageInputProps>(
  (
    {
      className,
      value,
      onChange,
      previewClassName,
      fallbackText = 'Upload',
      ...props
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const objectUrl = useMemo(() => {
      if (value instanceof File) {
        return URL.createObjectURL(value);
      }
      return null;
    }, [value]);

    useEffect(() => {
      return () => {
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
        }
      };
    }, [objectUrl]);

    const preview = typeof value === 'string' ? value : objectUrl;

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && onChange) {
        onChange(file);
      }
    };

    const handleRemove = (e: MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      if (inputRef.current) {
        inputRef.current.value = '';
      }
      if (onChange) {
        onChange(null);
      }
    };

    const handleClick = () => {
      inputRef.current?.click();
    };

    return (
      <div className={cn('mb-4 flex items-center gap-4', className)}>
        <div
          onClick={handleClick}
          className={cn(
            'group relative flex h-30 w-30 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-dashed transition-all hover:border-solid hover:bg-muted/50',
            preview ? 'border-none' : 'border-muted-foreground/25',
            previewClassName
          )}
        >
          {preview ? (
            <>
              <Avatar className="h-full w-full rounded-none">
                <AvatarImage src={preview} className="object-cover" />
                <AvatarFallback className="rounded-none">
                  {fallbackText}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <Camera className="h-6 w-6 text-white" />
                <span className="text-xs font-medium text-white">Change</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-1 text-muted-foreground">
              <Upload className="h-6 w-6" />
              <span className="text-xs font-medium">{fallbackText}</span>
            </div>
          )}
        </div>

        {preview && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={handleRemove}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Remove
          </Button>
        )}

        <input
          {...props}
          ref={(e: HTMLInputElement | null) => {
            inputRef.current = e;
            if (typeof ref === 'function') {
              ref(e);
            } else if (ref) {
              ref.current = e;
            }
          }}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
    );
  }
);

ImageInput.displayName = 'ImageInput';
