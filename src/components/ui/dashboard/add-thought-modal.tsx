"use client";

import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { X } from "lucide-react";

import { toast } from "react-hot-toast";

import { ContentType } from "@/src/generated/prisma/enums";

import { CreateThoughtSchema, type CreateThoughtInput } from "@/src/lib/validation/thought";

import { createThought } from "@/src/action/thoughts";

import { Input } from "../Input";
import { Label } from "../Label";
import { Button } from "../Button";

interface AddThoughtModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddThoughtModal({
  isOpen,
  onClose,
}: AddThoughtModalProps) {
  const [isPending, setIsPending] =
    useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CreateThoughtInput>({
    resolver: zodResolver(
      CreateThoughtSchema,
    ),

    defaultValues: {
      title: "",
      description: "",
      url: "",
      type: ContentType.THOUGHT,
      tags: [],
    },
  });

  if (!isOpen) return null;

  async function onSubmit(
    data: CreateThoughtInput,
  ) {
    try {
      setIsPending(true);

      const result =
        await createThought(data);

      if (result?.error) {
        toast.error(
          "Failed to add thought.",
        );

        return;
      }

      toast.success(
        "Thought added successfully.",
      );

      reset();
      onClose();

    } catch (error) {
      console.error(error);

      toast.error(
        "Something went wrong.",
      );

    } finally {
      setIsPending(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/50
        p-4
        backdrop-blur-sm
      "
    >
      <div
        className="
          relative
          w-full max-w-lg
          rounded-xl
          border border-border
          bg-card
          p-6
          shadow-lg
        "
      >
        <button
          type="button"
          onClick={onClose}
          className="
            absolute right-4 top-4
            text-muted-foreground
            hover:text-foreground
          "
        >
          <X size={16}  className=" cursor-pointer "/>
        </button>

        <h2
          className="
            mb-4
            text-lg
            font-semibold
            text-foreground
          "
        >
          Add Thought
        </h2>

        <form
          onSubmit={handleSubmit(
            onSubmit,
          )}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="url">
              Source URL
            </Label>

            <Input
              id="url"
              placeholder="https://..."
              disabled={isPending}
              error={!!errors.url}
              {...register("url")}
            />

            {errors.url && (
              <p className="mt-1 text-xs text-red-500">
                {errors.url.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="title">
              Title
            </Label>

            <Input
              id="title"
              placeholder="Thought title"
              disabled={isPending}
              error={!!errors.title}
              {...register("title")}
            />

            {errors.title && (
              <p className="mt-1 text-xs text-red-500">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description">
              Description
            </Label>

            <textarea
              id="description"
              rows={4}
              disabled={isPending}
              {...register(
                "description",
              )}
              className="
                w-full rounded-md
                border border-input
                bg-background
                p-3 text-sm
              "
            />
          </div>

          <div>
            <Label htmlFor="tags">
              Tags
            </Label>

            <Input
              id="tags"
              placeholder="ai, startup, design"
              disabled={isPending}
              onChange={(e) => {
                const tags =
                  e.target.value
                    .split(",")
                    .map((tag) =>
                      tag.trim(),
                    )
                    .filter(Boolean);

                setValue(
                  "tags",
                  tags,
                );
              }}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className=" cursor-pointer "
            >
              Cancel
            </Button>

            <Button
              type="submit"
              isLoading={isPending}
              className=" cursor-pointer "
            >
              Save Thought
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}