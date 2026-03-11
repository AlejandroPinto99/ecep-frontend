import React, { useEffect, useState } from "react";

// Hooks
import { useForm } from "react-hook-form";

//componentes
import Select from "react-select";
import { Input } from "../Form/Input";
import Loader from "../Loader/Loader";

// Queries
import { useGetPatientById } from "../../hooks/useGetPatients";
import { useGetPsychomotorParameters } from "../../hooks/psycomotor/useGetPsychomotorParameters";

export const PsychomotorHistory = ({ isEditing, setIsOpen, onSuccess = () => {} }) => {
  const { data } = useGetPatientById({ patient_id: isEditing });
  const {
    data: psychomotorParameters,
    isLoading: isLoadingPsychomotorParameters,
  } = useGetPsychomotorParameters();
  const methods = useForm();

  const onSubmitCreate = async (data) => {
    console.log({ data })
  };

  const { reset } = methods;

  useEffect(() => {
    if (data) {
      reset();
    }
  }, [data, reset]);
  return (
    <div>
      <>
        {!isLoadingPsychomotorParameters && (
          <form onSubmit={methods.handleSubmit(onSubmitCreate)}>
            <div className="grid grid-cols-2 gap-2">
              {psychomotorParameters.map((parameter) => (
                <Input
                  key={parameter.id_parametro_psicomotor}
                  name={parameter.id_parametro_psicomotor.toString()}
                  label={parameter.nombre}
                  methods={methods}
                  placeholder=""
                  type="text"
                />
              ))}
            </div>
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
