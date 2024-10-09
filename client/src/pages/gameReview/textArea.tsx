import { Textarea } from "@chakra-ui/react";

export function TextAreaInput({
  value,
  setValue,
  placeholder,
  borderColor,
  color,
}: any) {
  let handleInputChange = (e: any) => {
    let inputValue = e.target.value;
    setValue(inputValue);
  };
  return (
    <>
      <Textarea
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder || "Here is a sample placeholder"}
        size="sm"
        color={color || "white"}
        variant={"flushed"}
        _placeholder={{
          fontSize: "1rem",
        }}
        borderColor={borderColor || "gray.700"}
      />
    </>
  );
}
