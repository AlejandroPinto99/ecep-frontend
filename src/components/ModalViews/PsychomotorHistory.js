import { useEffect, useState } from "react";

// Hooks
import { useForm } from "react-hook-form";

//componentes
import { Input } from "../Form/Input";

// Queries
import { useGetPsychomotorParameters } from "../../hooks/psycomotor/useGetPsychomotorParameters";
import { useCreatePsychomotorHistory } from "../../hooks/psycomotor/useCreatePyschomotorHistory";
import { useUpdatePsychomotorHistory } from "../../hooks/psycomotor/useUpdatePsychomotorHistory";
import {
  useGetPsychomotorHistoryParameters,
} from "../../hooks/psycomotor/useGetPsychomotorHistory";
import { toast } from "react-toastify";

export const PsychomotorHistory = ({
  patient_id,
  setIsOpen,
  onSuccess = () => {},
  action,
  psychomotorHistory
}) => {
  const {
    data: psychomotorParameters,
    isLoading: isLoadingPsychomotorParameters,
  } = useGetPsychomotorParameters();
  const {
    data: psychomotorHistoryParameters,
    isLoading: isLoadingPsychomotorHistoryParameters,
  } = useGetPsychomotorHistoryParameters({
    evaluacion_id: psychomotorHistory?.id_evaluacion,
  });
  const { mutate: updatePsychomotorHistory } = useUpdatePsychomotorHistory({
    evaluation_id: psychomotorHistory?.id_evaluacion,
  });
  const methods = useForm();
  const { mutate: createPsychomotorHistory } = useCreatePsychomotorHistory();
  const onSubmitCreate = async (data) => {
    const formattedParameters = Object.entries(data)
      .filter(([key]) => key !== "general_observations")
      .map(([key, value]) => ({
        key,
        value,
      }));
    if (action === "edit") {
      updatePsychomotorHistory(
        {
          evaluation_id: psychomotorHistory?.id_evaluacion,
          psychomotorData: {
            psychomotor_parameter: formattedParameters,
            patient_id: patient_id,
            general_observations: data["general_observations"],
          },
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
            psychomotor_parameter: formattedParameters,
            patient_id: patient_id,
            general_observations: data["general_observations"],
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
    if (psychomotorHistoryParameters) {
      methods.reset({
        general_observations: psychomotorHistory?.observacion_general || "",
        ...Object.values(psychomotorHistoryParameters).reduce((acc, param) => {
          acc[param.id_parametro] = param.valor;
          return acc;
        }, {}),
      });
    }
  }, [psychomotorHistoryParameters]);

  return (
    <div>
      <>
        {!isLoadingPsychomotorParameters && (
          <form onSubmit={methods.handleSubmit(onSubmitCreate)}>
            <div className="grid grid-cols-2 gap-2">
              {psychomotorParameters.map((parameter) => action !== "view" ? (
                <Input
                  key={parameter.id_parametro_psicomotor}
                  name={parameter.id_parametro_psicomotor.toString()}
                  label={parameter.nombre}
                  methods={methods}
                  placeholder=""
                  type="text"
                />
              ) : (
                <div key={parameter.id_parametro_psicomotor} className="flex items-center">
                  <label className="block text-sm font-medium text-gray-700 mr-2">
                    {parameter.nombre}
                  </label>
                  <span className="text-gray-900">{psychomotorHistoryParameters?.[parameter.id_parametro_psicomotor - 1]?.valor  + " meses" || "No especificado"}</span>
                </div>
              ))}
            </div>
            {
              action !== "view" ? (
                <Input
                  key="general_observations"
                  name="general_observations"
                  label="Observaciones Generales"
                  methods={methods}
                  placeholder=""
                  type="text"
            />) : (
              <div className="flex items-center mt-4">
                <label className="block text-sm font-medium text-gray-700 mr-2">
                  Observaciones Generales:
                </label>
                <span className="text-gray-900">
                  {psychomotorHistory?.observacion_general || "No especificado"}
                </span>
              </div>
            )
            }
           
            <div className="flex w-full justify-end items-center mt-4">
              <button
                type="submit"
                className=" bg-klintoRed text-white text-xl px-4 py-2 rounded-xl"
              >
                Guardar
              </button>
            </div>
          </form>
        )}
      </>
    </div>
  );
};
