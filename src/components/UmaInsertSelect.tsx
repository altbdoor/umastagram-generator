import { Radio, Label, Button } from "@cloudflare/kumo";

export function UmaInsertSelect() {
  return (
    <>
      <div className="uma-align__image">
        <Label>Change insert image</Label>

        <div>
          <Button>Oguri Cap</Button>
          <Button>Sakura Laurel</Button>
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
