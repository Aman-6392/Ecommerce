import React from "react";
import "./StepIndicator.css";

function StepIndicator({ currentStep = 1 }) {
  const steps = ["Cart", "Address", "Review", "Payment"];

  return (
    <div className="step-wrapper">
      <div className="step-container">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = currentStep === stepNumber;
          const isCompleted = currentStep > stepNumber;

          return (
            <div key={step} className="step">
              <div
                className={`step-circle ${
                  isActive ? "active" : ""
                } ${isCompleted ? "completed" : ""}`}
              >
                {isCompleted ? "✓" : stepNumber}
              </div>

              <div
                className={`step-label ${
                  isActive ? "active-label" : ""
                }`}
              >
                {step}
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`step-line ${
                    isCompleted ? "line-completed" : ""
                  }`}
                ></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StepIndicator;