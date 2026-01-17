import { useAISidebar, WIZARD_STEPS, type WizardType } from '@/state/useAISidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Sparkles, X, Loader2 } from 'lucide-react';

interface WizardFormProps {
  type: WizardType;
}

export function WizardForm({ type }: WizardFormProps) {
  const {
    wizardStep,
    wizardData,
    setWizardData,
    nextWizardStep,
    prevWizardStep,
    finishWizard,
    cancelWizard,
    isGenerating,
  } = useAISidebar();

  if (!type) return null;

  const steps = WIZARD_STEPS[type];
  const currentStep = steps[wizardStep];
  const isLastStep = wizardStep === steps.length - 1;
  const progress = ((wizardStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (isLastStep) {
      finishWizard();
    } else {
      nextWizardStep();
    }
  };

  const renderInput = () => {
    const value = wizardData[currentStep.id] || '';

    switch (currentStep.type) {
      case 'textarea':
        return (
          <Textarea
            id={currentStep.id}
            value={value}
            onChange={(e) => setWizardData(currentStep.id, e.target.value)}
            placeholder={currentStep.placeholder}
            rows={4}
            className="resize-none"
          />
        );
      case 'select':
        return (
          <Select
            value={value}
            onValueChange={(v) => setWizardData(currentStep.id, v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {currentStep.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'date':
        return (
          <Input
            id={currentStep.id}
            type="date"
            value={value}
            onChange={(e) => setWizardData(currentStep.id, e.target.value)}
          />
        );
      default:
        return (
          <Input
            id={currentStep.id}
            value={value}
            onChange={(e) => setWizardData(currentStep.id, e.target.value)}
            placeholder={currentStep.placeholder}
          />
        );
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div>
          <h3 className="font-semibold text-sm capitalize">{type} Generator</h3>
          <p className="text-xs text-muted-foreground">
            Step {wizardStep + 1} of {steps.length}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={cancelWizard}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-muted">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Form Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4 animate-fade-in" key={currentStep.id}>
          <div className="space-y-2">
            <Label htmlFor={currentStep.id} className="text-sm font-medium">
              {currentStep.label}
              {currentStep.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            {renderInput()}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-2 p-4 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={prevWizardStep}
          disabled={wizardStep === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>

        <Button
          variant={isLastStep ? 'default' : 'default'}
          size="sm"
          onClick={handleNext}
          disabled={
            isGenerating ||
            (currentStep.required && !wizardData[currentStep.id])
          }
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : isLastStep ? (
            <>
              <Sparkles className="h-4 w-4" />
              Generate
            </>
          ) : (
            <>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
