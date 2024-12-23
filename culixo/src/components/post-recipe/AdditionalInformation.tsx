import React, { useState, useCallback, useMemo } from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import type { StepComponentProps } from '@/types/post-recipe/recipe';

const MAX_TAGS = 10;
const MAX_NOTES_LENGTH = 250;
const TAG_REGEX = /^[a-zA-Z0-9\s-]+$/;
const MAX_TAG_LENGTH = 20;

const AdditionalInformation: React.FC<StepComponentProps> = ({
  formData,
  setFormData,
  onNext,
  onPrevious,
}) => {
  const [newTag, setNewTag] = useState('');
  const [tagError, setTagError] = useState<string>('');

  const tags = useMemo(() => formData.tags || [], [formData.tags]);
  const notes = formData.additionalInfo.cookingTips?.join('\n') || '';

  const validateTag = useCallback((tag: string): boolean => {
    if (!tag.trim()) {
      setTagError('Tag cannot be empty');
      return false;
    }
    if (tag.length > MAX_TAG_LENGTH) {
      setTagError(`Tag must be ${MAX_TAG_LENGTH} characters or less`);
      return false;
    }
    if (!TAG_REGEX.test(tag)) {
      setTagError('Tag can only contain letters, numbers, spaces, and hyphens');
      return false;
    }
    if (tags.includes(tag.trim())) {
      setTagError('This tag already exists');
      return false;
    }
    return true;
  }, [tags]);

  const addTag = useCallback(() => {
    const tag = newTag.trim();
    if (tags.length >= MAX_TAGS) {
      setTagError('Maximum number of tags reached');
      return;
    }
    if (validateTag(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tag],
      }));
      setNewTag('');
      setTagError('');
    }
  }, [newTag, tags.length, setFormData, validateTag]);

  const removeTag = useCallback((tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || [],
    }));
  }, [setFormData]);

  const updateNotes = useCallback((value: string) => {
    const tipsArray = value.split('\n').filter(tip => tip.trim() !== '');
    
    setFormData(prev => ({
      ...prev,
      additionalInfo: {
        ...prev.additionalInfo,
        cookingTips: tipsArray,
      },
    }));
  }, [setFormData]);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Rest of the component remains the same */}
      {/* Title */}
      <h2 className="text-2xl font-semibold">Additional Information</h2>

      {/* Tags Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recipe Tags</CardTitle>
          <CardDescription>
            Add up to {MAX_TAGS} tags to help users find your recipe
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {/* Tag Input */}
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Add a tag (e.g., Italian, Vegetarian, Quick Meal)"
                  value={newTag}
                  onChange={(e) => {
                    setNewTag(e.target.value);
                    setTagError('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  className={tagError ? 'border-destructive' : ''}
                  disabled={tags.length >= MAX_TAGS}
                />
                {tagError && (
                  <p className="mt-1 text-sm text-destructive">{tagError}</p>
                )}
              </div>
              <Button
                onClick={addTag}
                className="bg-white hover:bg-white/90 text-black rounded-full px-6 font-medium"
                disabled={tags.length >= MAX_TAGS}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Tag
              </Button>
            </div>

            {/* Tags Display */}
            <div className="flex flex-wrap gap-2 pt-2">
              {tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="group px-3 py-1.5 text-sm"
                >
                  {tag}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeTag(tag)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>

            {/* Tag Counter */}
            <p className="text-sm text-muted-foreground">
              {tags.length}/{MAX_TAGS} tags used
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notes Section */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Notes</CardTitle>
          <CardDescription>
            Add any special tips or notes about your recipe (optional)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Textarea
              placeholder="Any special tips or notes about your recipe?"
              value={notes}
              onChange={(e) => updateNotes(e.target.value)}
              maxLength={MAX_NOTES_LENGTH}
              className="min-h-[100px] resize-none"
            />
            <p className="text-sm text-muted-foreground text-right">
              {notes.length}/{MAX_NOTES_LENGTH} characters
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={onPrevious}
          className="min-w-[100px]"
        >
          Previous
        </Button>
        <Button
          variant="default"
          onClick={onNext}
          className="min-w-[100px]"
        >
          Preview
        </Button>
      </div>
    </div>
  );
};

export default AdditionalInformation;