import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  return (
    <>
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div
          key={step}
          className={`mt-2.5 text-5xl font-light text-center uppercase text-white ${
            step === currentStep
              ? 'text-opacity-70'
              : step < currentStep
              ? 'text-opacity-30'
              : 'text-opacity-10'
          } max-md:text-4xl`}
        >
          {step}
        </div>
      ))}
    </>
  );
};

export default StepIndicator;