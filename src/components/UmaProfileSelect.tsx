import { Button, Combobox } from "@cloudflare/kumo";
import { useCallback, useEffect, useState } from "react";
import type { Uma } from "../types";

interface UmaProfileSelectProps {
  value: Uma | null;
  onValueChange: (value: Uma | null) => void;
  defaultUmaName?: string;
}

export function UmaProfileSelect({
  onValueChange,
  defaultUmaName,
  ...props
}: UmaProfileSelectProps) {
  const [umaOptions, setUmaOptions] = useState<Uma[]>([]);
  const { contains } = Combobox.useFilter();

  useEffect(() => {
    let base = String(import.meta.env.VITE_BASE ?? "");
    if (base.endsWith("/")) {
      base = base.slice(0, -1);
    }

    fetch(`${base}/char-list.json`)
      .then((res) => res.json())
      .then((res: Uma[]) => {
        setUmaOptions(res);

        if (defaultUmaName) {
          const activeUma = res.find((uma) => uma.name_en === defaultUmaName);
          if (activeUma) {
            onValueChange(activeUma);
          }
        }
      });
  }, [onValueChange, defaultUmaName]);

  const umaFilter = useCallback(
    (item: Uma, query: string) => {
      return contains(item.name_en, query);
    },
    [contains],
  );

  return (
    <Combobox
      label="Umamusume profile"
      value={props.value}
      onValueChange={onValueChange}
      items={umaOptions}
      filter={umaFilter}
    >
      <Combobox.Trigger render={<Button variant="outline" style={{ height: "auto" }} />}>
        <Combobox.Value>
          {props.value && (
            <div className="container__options__profile-img-box container__options__profile-img-box--vertical">
              <img
                src={props.value?.sns_icon}
                alt={props.value?.name_en}
                width={64}
                height={64}
                style={{ color: props.value?.color_main }}
              />
              <span>{props.value?.name_en ?? ""}</span>
            </div>
          )}

          {!props.value && "Please select"}
        </Combobox.Value>
      </Combobox.Trigger>

      <Combobox.Content>
        <Combobox.Input placeholder="Search Umamusume" />

        <Combobox.Empty />

        <Combobox.List>
          {(item: Uma) => (
            <Combobox.Item key={item.id} value={item}>
              <div className="container__options__profile-img-box container__options__profile-img-box--horizontal">
                <img
                  src={item.sns_icon}
                  alt={item.name_en}
                  loading="lazy"
                  width={48}
                  height={48}
                  style={{ color: item.color_main }}
                />
                <span>{item.name_en}</span>
              </div>
            </Combobox.Item>
          )}
        </Combobox.List>
      </Combobox.Content>
    </Combobox>
  );
}
