import debounce from "lodash/debounce";
import { Slider } from "primereact/slider";
import { type FC, useEffect, useMemo, useState } from "react";

interface SmoothSliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (val: number) => void;
  label: string;
  unit?: string;
}

const SmoothSlider: FC<SmoothSliderProps> = ({
  value,
  min,
  max,
  step = 1,
  onChange,
  label,
  unit,
}) => {
  const [localVal, setLocalVal] = useState(value);
  useEffect(() => {
    setLocalVal(value);
  }, [value]);
  const debouncedUpdate = useMemo(
    () =>
      debounce((nextVal: number) => {
        onChange(nextVal);
      }, 150),
    [onChange]
  );

  const handleChange = (e: any) => {
    setLocalVal(e.value);
    debouncedUpdate(e.value);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="font-bold text-blue-500">
          {localVal} {unit}
        </span>
      </div>
      <Slider
        value={localVal}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
    </div>
  );
};

export default SmoothSlider;
