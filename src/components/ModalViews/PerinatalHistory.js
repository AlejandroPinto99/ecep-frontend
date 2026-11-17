import { useEffect } from "react";

// Hooks
import { useForm } from "react-hook-form";

//componentes
import Select from "react-select";
import { Input } from "../Form/Input";

// Queries
import { useCreatePerinatalHistory } from "../../hooks/perinatal/useCreatePerinatalHistory";
import { useUpdatePerinatalHistory } from "../../hooks/perinatal/useUpdatePerinatalHistory";

const TERMINO_OPTIONS = [
  { label: "A término", value: "A término" },
  { label: "Pretérmino", value: "Pretérmino" },
  { label: "Postérmino", value: "Postérmino" },
];
const TIPO_PARTO_OPTIONS = [
  { label: "Vaginal", value: "Vaginal" },
  { label: "Cesárea", value: "Cesárea" },
];
const TIPO_SANGRE_OPTIONS = [
  { label: "A", value: "A" },
  { label: "B", value: "B" },
  { label: "AB", value: "AB" },
  { label: "O", value: "O" },
];
const FACTOR_RH_OPTIONS = [
  { label: "Positivo", value: "Positivo" },
  { label: "Negativo", value: "Negativo" },
];

const toOption = (options, value) =>
  value ? options.find((option) => option.value === value) || null : null;

const toNullableNumber = (value) =>
  value === "" || value === undefined || value === null ? null : Number(value);

const toNullableText = (value) =>
  value === "" || value === undefined ? null : value;

export const PerinatalHistory = ({
  patient_id,
  setIsOpen,
  onSuccess = () => {},
  action,
  perinatalHistory,
}) => {
  const methods = useForm();
  const { mutate: createPerinatalHistory } = useCreatePerinatalHistory();
  const { mutate: updatePerinatalHistory } = useUpdatePerinatalHistory();

  const onSubmitCreate = async (data) => {
    const payload = {
      termino: data.termino?.value ?? null,
      semanas_gestacion: toNullableNumber(data.semanas_gestacion),
      tipo_parto: data.tipo_parto?.value ?? null,
      peso_nacer_lb: toNullableNumber(data.peso_nacer_lb),
      talla_nacer_cm: toNullableNumber(data.talla_nacer_cm),
      tipo_sangre: data.tipo_sangre?.value ?? null,
      factor_rh: data.factor_rh?.value ?? null,
      condicion_al_nacer: toNullableText(data.condicion_al_nacer),
      condicion_primera_semana: toNullableText(data.condicion_primera_semana),
      alimentacion: toNullableText(data.alimentacion),
    };

    if (action === "edit") {
      updatePerinatalHistory(
        {
          patient_id,
          perinatalData: payload,
        },
        {
          onSuccess: (data) => {
            setIsOpen();
            onSuccess(data);
          },
        },
      );
    } else {
      createPerinatalHistory(
        {
          perinatalData: {
            patient_id,
            ...payload,
          },
        },
        {
          onSuccess: (data) => {
            setIsOpen();
            onSuccess(data);
          },
        },
      );
    }
  };

  useEffect(() => {
    if (action !== "create" && perinatalHistory) {
      methods.reset({
        termino: toOption(TERMINO_OPTIONS, perinatalHistory.termino),
        semanas_gestacion: perinatalHistory.semanas_gestacion ?? "",
        tipo_parto: toOption(TIPO_PARTO_OPTIONS, perinatalHistory.tipo_parto),
        peso_nacer_lb: perinatalHistory.peso_nacer_lb ?? "",
        talla_nacer_cm: perinatalHistory.talla_nacer_cm ?? "",
        tipo_sangre: toOption(TIPO_SANGRE_OPTIONS, perinatalHistory.tipo_sangre),
        factor_rh: toOption(FACTOR_RH_OPTIONS, perinatalHistory.factor_rh),
        condicion_al_nacer: perinatalHistory.condicion_al_nacer ?? "",
        condicion_primera_semana: perinatalHistory.condicion_primera_semana ?? "",
        alimentacion: perinatalHistory.alimentacion ?? "",
      });
    }
  }, [action, perinatalHistory]);

  const isView = action === "view";

  const renderSelect = (name, label, options) => (
    <div>
      <label className="text-sm font-semibold">{label}</label>
      {isView ? (
        <p className="text-gray-900">
          {perinatalHistory?.[name] || "No especificado"}
        </p>
      ) : (
        <Select
          options={options}
          className="rounded-lg"
          isClearable
          onChange={(value) => methods.setValue(name, value)}
          value={methods.watch(name)}
        />
      )}
    </div>
  );

  const renderField = (name, label, type = "text") =>
    isView ? (
      <div>
        <label className="text-sm font-semibold">{label}</label>
        <p className="text-gray-900">
          {perinatalHistory?.[name] ?? "No especificado"}
        </p>
      </div>
    ) : (
      <Input
        name={name}
        label={label}
        methods={methods}
        placeholder=""
        type={type}
      />
    );

  return (
    <div>
      <form onSubmit={methods.handleSubmit(onSubmitCreate)}>
        <div className="grid grid-cols-2 gap-2">
          {renderSelect("termino", "Término", TERMINO_OPTIONS)}
          {renderField("semanas_gestacion", "Semanas de gestación", "number")}
          {renderSelect("tipo_parto", "Tipo de parto", TIPO_PARTO_OPTIONS)}
          {renderField("peso_nacer_lb", "Peso al nacer (lb)", "number")}
          {renderField("talla_nacer_cm", "Talla al nacer (cm)", "number")}
          {renderSelect("tipo_sangre", "Tipo de sangre", TIPO_SANGRE_OPTIONS)}
          {renderSelect("factor_rh", "Factor Rh", FACTOR_RH_OPTIONS)}
          {renderField("condicion_al_nacer", "Condición al nacer", "textarea")}
          {renderField(
            "condicion_primera_semana",
            "Condición primera semana",
            "textarea",
          )}
          {renderField("alimentacion", "Alimentación", "textarea")}
        </div>
        {!isView && (
          <div className="flex w-full justify-end items-center mt-4">
            <button
              type="submit"
              className=" bg-klintoRed text-white text-xl px-4 py-2 rounded-xl"
            >
              Guardar
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
