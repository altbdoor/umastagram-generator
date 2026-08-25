import { Radio, Label, Button } from "@cloudflare/kumo";

export function UmaInsertSelect() {
  return (
    <>
      <div>
        <Label>Change insert image</Label>
        <div>
          <Button>asd</Button>
          <Button>asd</Button>
        </div>
      </div>

      <Radio.Group
        legend="Align insert image"
        orientation="horizontal"
        // value={value}
        // onValueChange={setValue}
      >
        <Radio.Item label="Left" value="left" />
        <Radio.Item label="Right" value="right" />
      </Radio.Group>
    </>
  );
}
