import classNames from "classnames";

export const Card = ({ className, children, ...props }) => {
  return (
    <div
      className={classNames(
        "rounded-2xl border bg-white p-6 shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardContent = ({ className, children, ...props }) => {
  return (
    <div className={classNames("mt-2 text-sm text-gray-700", className)} {...props}>
      {children}
    </div>
  );
};
