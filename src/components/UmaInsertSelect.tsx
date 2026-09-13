import { Button, Dialog, Input, Label, Link, Text } from "@cloudflare/kumo";
import { useState } from "react";
import machanPlush from "../assets/img/machan-plush.png";
import { insertOptions } from "./series-options";

interface UmaInsertSelectProps {
  value: number;
  onValueChange: (val: number) => void;
}

export function UmaInsertSelect(props: UmaInsertSelectProps) {
  const [insertQuery, setInsertQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  let filteredInsertOptions: { opt: (typeof insertOptions)[number]; idx: number }[] = [];
  if (isDialogOpen) {
    filteredInsertOptions = insertOptions
      .map((opt, idx) => ({ opt, idx }))
      .filter(({ opt }) => opt.label.toLowerCase().includes(insertQuery.toLowerCase()));
  }

  const onDialogOpenChange = (isOpen: boolean) => {
    setIsDialogOpen(isOpen);

    if (!isOpen) {
      setInsertQuery("");
    }
  };

  const onSelectInsert = (idx: number) => {
    props.onValueChange(idx);
    onDialogOpenChange(false);
  };

  return (
    <div className="uma-insert">
      <Label>
        Insert image (
        <Link href="https://umamusu.wiki/w/index.php?title=Category:Stamps">
          Stamps from umamusu.wiki
        </Link>
        )
      </Label>

      <Dialog.Root open={isDialogOpen} onOpenChange={onDialogOpenChange}>
        <Dialog.Trigger
          render={(p) => (
            <Button variant="secondary" type="button" {...p}>
              Change insert image
            </Button>
          )}
        />

        <Dialog size="lg">
          <div className="uma-insert__choices">
            <div className="uma-insert__choices-top">
              <Input
                placeholder="Type to search insert image"
                value={insertQuery}
                onValueChange={(val) => setInsertQuery(val ?? "")}
                autoFocus
                aria-label="Insert image"
              />
            </div>

            <ul>
              {isDialogOpen &&
                filteredInsertOptions.map(({ opt, idx }) => (
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

              {isDialogOpen && filteredInsertOptions.length === 0 && (
                <li className="uma-insert__choices-empty">
                  <img src={machanPlush} width={128} height={128} alt="Machan" />
                  <Text>No matches found. Try other search terms.</Text>
                </li>
              )}
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
