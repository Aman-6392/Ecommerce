import React from "react";
import "./StepIndicator.css";

function StepIndicator({ currentStep }) {
  const steps = ["Cart", "Address", "Review", "Payment"];

  return (
    <div className="step-wrapper">
      <div className="step-container">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = currentStep === stepNumber;
          const isCompleted = currentStep > stepNumber;

          return (
            <div
              key={index}
              className={`step ${
                isActive ? "active" : ""
              } ${isCompleted ? "completed" : ""}`}
            >
              <div className="step-circle">
                {isCompleted ? "✓" : stepNumber}
              </div>

              <div className="step-label">{step}</div>

              {index !== steps.length - 1 && (
                <div className="step-line"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StepIndicator;