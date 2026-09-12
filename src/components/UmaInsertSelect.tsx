import { Button, Dialog, Label } from "@cloudflare/kumo";
import { useState } from "react";
import { insertOptions } from "./series-options";

interface UmaInsertSelectProps {
  value: number;
  onValueChange: (val: number) => void;
}

export function UmaInsertSelect(props: UmaInsertSelectProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const onSelectInsert = (idx: number) => {
    props.onValueChange(idx);
    setIsDialogOpen(false);
  };

  return (
    <div className="uma-insert">
      <Label>Insert image</Label>

      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Trigger
          render={(p) => (
            <Button variant="secondary" type="button" size="lg" {...p}>
              Change insert image
            </Button>
          )}
        />

        <Dialog size="lg">
          <div className="uma-insert__choices">
            <Label>Insert image</Label>

            <ul>
              {insertOptions.map((opt, idx) => (
                <li key={idx}>
                  <Button
                    variant="secondary"
                    type="button"
                    className={`uma-insert__choices-btn ${props.value === idx ? "uma-insert__choices-btn--active" : ""}`}
                    onClick={() => onSelectInsert(idx)}
                  >
                    {opt.label === "Empty" && <span>{opt.label}</span>}
                    {opt.label !== "Empty" && (
                      <img src={opt.image} loading="lazy" alt={opt.label} />
                    )}
                  </Button>
                </li>
              ))}
            </ul>

            <div className="uma-insert__choices-bottom">
              <Dialog.Close
                render={(p) => (
                  <Button type="button" variant="secondary-destructive" {...p}>
                    Cancel
                  </Button>
                )}
              />
            </div>
          </div>
        </Dialog>
      </Dialog.Root>
    </div>
  );
}
