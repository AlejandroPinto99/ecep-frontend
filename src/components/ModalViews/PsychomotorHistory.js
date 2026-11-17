import { useEffect } from "react";

// Hooks
import { useForm } from "react-hook-form";

//componentes
import { Input } from "../Form/Input";

// Queries
import { useCreatePsychomotorHistory } from "../../hooks/psycomotor/useCreatePyschomotorHistory";
import { useUpdatePsychomotorHistory } from "../../hooks/psycomotor/useUpdatePsychomotorHistory";

const toNullableNumber = (value) =>
  value === "" || value === undefined || value === null ? null : Number(value);

const toNullableText = (value) =>
  value === "" || value === undefined ? null : value;

export const PsychomotorHistory = ({
  patient_id,
  setIsOpen,
  onSuccess = () => {},
  action,
  psychomotorHistory,
}) => {
  const methods = useForm();
  const { mutate: createPsychomotorHistory } = useCreatePsychomotorHistory();
  const { mutate: updatePsychomotorHistory } = useUpdatePsychomotorHistory();

  const onSubmitCreate = async (data) => {
    const payload = {
      edad_se_sento_meses: toNullableNumber(data.edad_se_sento_meses),
      edad_se_paro_meses: toNullableNumber(data.edad_se_paro_meses),
      edad_camino_meses: toNullableNumber(data.edad_camino_meses),
      edad_primer_diente_meses: toNullableNumber(data.edad_primer_diente_meses),
      observacion_desarrollo: toNullableText(data.observacion_desarrollo),
    };

    if (action === "edit") {
      updatePsychomotorHistory(
        {
          patient_id,
          psychomotorData: payload,
        },
        {
          onSuccess: (data) => {
            setIsOpen();
            onSuccess(data);
          },
        },
      );
    } else {
      createPsychomotorHistory(
        {
          psychomotorData: {
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
    if (action !== "create" && psychomotorHistory) {
      methods.reset({
        edad_se_sento_meses: psychomotorHistory.edad_se_sento_meses ?? "",
        edad_se_paro_meses: psychomotorHistory.edad_se_paro_meses ?? "",
        edad_camino_meses: psychomotorHistory.edad_camino_meses ?? "",
        edad_primer_diente_meses:
          psychomotorHistory.edad_primer_diente_meses ?? "",
        observacion_desarrollo: psychomotorHistory.observacion_desarrollo ?? "",
      });
    }
  }, [action, psychomotorHistory]);

  const isView = action === "view";

  const renderField = (name, label, type = "text") =>
    isView ? (
      <div>
        <label className="text-sm font-semibold">{label}</label>
        <p className="text-gray-900">
          {psychomotorHistory?.[name] ?? "No especificado"}
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
          {renderField("edad_se_sento_meses", "Edad en que se sentó (meses)", "number")}
          {renderField("edad_se_paro_meses", "Edad en que se paró (meses)", "number")}
          {renderField("edad_camino_meses", "Edad en que caminó (meses)", "number")}
          {renderField(
            "edad_primer_diente_meses",
            "Edad del primer diente (meses)",
            "number",
          )}
        </div>
        <div className="mt-2">
          {renderField(
            "observacion_desarrollo",
            "Observaciones del desarrollo",
            "textarea",
          )}
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
