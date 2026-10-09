import type { ChangeEventHandler } from "react";

export const handleInputOnlyNumber: ChangeEventHandler<HTMLInputElement> = (
  event,
) => {
  const target = event.target as HTMLInputElement;
  const { value } = target;
  const lastChar = value.charAt(value.length - 1);

  if (!/[\d.]/.exec(lastChar)) {
    target.value = value.slice(0, -1);
    return;
  }

  if (value.length > 1 && value.startsWith("0") && value[1] !== ".") {
    target.value = value.slice(0, -1);
  }
};
