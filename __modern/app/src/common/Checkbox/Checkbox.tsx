import classnames from "classnames"
import Button from "stremio/common/Button"
import styles from "./styles.module.less"
import { ReactNode, forwardRef } from "react"

type CheckboxProps = {
  className?: string
  checked?: boolean
  children?: ReactNode
}

const Checkbox = forwardRef<HTMLElement, CheckboxProps>(
  ({ className, checked, children, ...props }, ref) => {
    return (
      <Button
        {...props}
        ref={ref}
        className={classnames(className, styles["checkbox-container"], {
          checked: checked,
        })}
      >
        <div className={styles["toggle"]} />
        {children}
      </Button>
    )
  },
)

Checkbox.displayName = "Checkbox"

export default Checkbox
