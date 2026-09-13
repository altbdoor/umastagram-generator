import { Button, Label } from "@cloudflare/kumo";

const options = [
  { label: "Oguri Cap x Cinderella Gray", value: "oguri1" },
  { label: "Sakura Laurel x Star Blossom", value: "sakura1" },
  { label: "Curren Chan", value: "curren" },
] as const;

export type UmaPresetOptions = (typeof options)[number]["value"];

interface UmaPresetProps {
  onPresetSelect: (val: UmaPresetOptions) => void;
}

export function UmaPreset(props: UmaPresetProps) {
  return (
    <div className="uma-preset">
      <Label>Preset</Label>

      <div className="uma-preset__buttons">
        {options.map((opt) => (
          <Button
            variant="secondary"
            type="button"
            key={opt.value}
            onClick={() => props.onPresetSelect(opt.value)}
          >
            {opt.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
