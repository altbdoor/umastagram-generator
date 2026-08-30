import { Button, Dialog, Input, Label, Link, Text } from "@cloudflare/kumo";
import { useEffect, useState } from "react";
import machanPlush from "../assets/img/machan-plush.png";
import type { FlatUma, Uma } from "../types";

interface UmaProfileSelectProps {
  value: FlatUma | null;
  onValueChange: (value: FlatUma | null) => void;
  defaultUmaName?: string;
}

function UmaProfileOption(props: { image: string; label: string; color: string }) {
  return (
    <>
      <img
        src={props.image}
        alt={props.label}
        loading="lazy"
        width={64}
        height={64}
        style={{ color: props.color }}
      />
      <span>{props.label}</span>
    </>
  );
}

export function UmaProfileSelect({
  onValueChange,
  defaultUmaName,
  ...props
}: UmaProfileSelectProps) {
  const [umaQuery, setUmaQuery] = useState("");
  const [umaOptions, setUmaOptions] = useState<FlatUma[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    let base = String(import.meta.env.VITE_BASE ?? "");
    if (base.endsWith("/")) {
      base = base.slice(0, -1);
    }

    fetch(`${base}/char-list.json`)
      .then((res) => res.json())
      .then((res: Uma[]) => {
        const flatRes = res.reduce((acc, val) => {
          const { images, ...data } = val;

          const flatImages = images.map((image) => {
            const cdnImage = `https://wsrv.nl/?url=${encodeURIComponent(image)}`;
            return { ...data, image: cdnImage };
          });

          return [...acc, ...flatImages];
        }, [] as FlatUma[]);

        setUmaOptions(flatRes);

        if (defaultUmaName) {
          const activeUma = flatRes.find((uma) => uma.name_en === defaultUmaName);
          if (activeUma) {
            onValueChange(activeUma);
          }
        }
      });
  }, [onValueChange, defaultUmaName]);

  let filteredUmaOptions: FlatUma[] = [];
  if (isDialogOpen) {
    filteredUmaOptions = umaOptions.filter((item) =>
      item.name_en.toLowerCase().includes(umaQuery.toLowerCase()),
    );
  }

  const onDialogOpenChange = (isOpen: boolean) => {
    setIsDialogOpen(isOpen);

    if (!isOpen) {
      setUmaQuery("");
    }
  };

  const onChoiceClick = (uma: FlatUma) => {
    onValueChange(uma);
    onDialogOpenChange(false);
  };

  return (
    <div className="uma-select">
      <Label>
        Character profile (<Link href="https://umapyoi.net/">Data from umapyoi.net</Link>)
      </Label>

      <Dialog.Root open={isDialogOpen} onOpenChange={onDialogOpenChange}>
        <Dialog.Trigger
          render={(p) => (
            <Button
              variant="secondary"
              type="button"
              size="lg"
              className="uma-select__trigger"
              {...p}
            >
              <div className="uma-select__choices-item">
                {props.value && (
                  <UmaProfileOption
                    image={props.value.image}
                    label={props.value.name_en}
                    color={props.value.color_main}
                  />
                )}

                {!props.value && "Please select"}
              </div>
            </Button>
          )}
        />

        <Dialog size="lg">
          <div className="uma-select__choices">
            <div className="uma-select__choices-top">
              <Input
                placeholder="Type to search Umamusume profile"
                value={umaQuery}
                onValueChange={(val) => setUmaQuery(val ?? "")}
                autoFocus
                aria-label="Character profile"
              />
            </div>

            <ul>
              {isDialogOpen &&
                filteredUmaOptions.map((item) => (
                  <li
                    key={item.id + item.image}
                    className="uma-select__choices-item"
                    onClick={() => onChoiceClick(item)}
                  >
                    <UmaProfileOption
                      image={item.image}
                      label={item.name_en}
                      color={item.color_main}
                    />
                  </li>
                ))}

              {isDialogOpen && filteredUmaOptions.length === 0 && (
                <li className="uma-select__choices-empty">
                  <img src={machanPlush} width={128} height={128} alt="Machan" />
                  <Text>No matches found. Try other search terms.</Text>
                </li>
              )}
            </ul>

            <div className="uma-select__choices-bottom">
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
