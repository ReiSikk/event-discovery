import React from 'react'
import { Check } from 'lucide-react'
import styles from './ProgressSteps.module.css'
import classNames from 'classnames'

function ProgressSteps({ eventProgress }) {
  return (
         <div className={styles.formProgress}>
              <h3>Event creation steps</h3>
              {eventProgress.steps.map((step, index) => (
                <div 
                  key={step.id}
                  className={classNames(
                    styles.progressStep,
                    eventProgress.currentStep === index && styles.currentStep,
                    eventProgress.completedSteps.includes(step.id) && styles.completedStep
                  )}
                >
                  {eventProgress.completedSteps.includes(step.id) ? (
                    <Check size={16} className={styles.checkIcon} />
                  ) : (
                    <span className={styles.stepNumber}>{index + 1}</span>
                  )}
                  <div>
                    <h4 className={styles.progressStep__title}>{step.title}</h4>
                    <p className={`${styles.progressStep__text} txt-small`}>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
  )
}

export default ProgressSteps