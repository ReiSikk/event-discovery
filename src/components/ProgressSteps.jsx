import React from 'react'
import { Check } from 'lucide-react'
import styles from './ProgressSteps.module.css'
import classNames from 'classnames'

function ProgressSteps({ eventProgress, formStep }) {
  return (
         <div className={styles.formProgress}>
              <h4 className='col-m-none'>Event creation steps</h4>
              <h4 className='col-t-none col-d-none'>{`Step ${formStep + 1} of 5`}</h4>
              {eventProgress.steps.map((step, index) => (
                <div 
                  className={classNames(
                    styles.progressStep,
                    formStep === index && styles.currentStep,
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