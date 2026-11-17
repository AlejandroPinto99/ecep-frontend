import { useForm } from "react-hook-form";
import Select from "react-select";
import { toast } from "react-toastify";

// componentes
import { Input } from "../Form/Input";

// Queries
import { useGetDiseaseParameters } from "../../hooks/diseaseHistory/useGetDiseaseParameters";
import { useCreateDiseaseHistory } from "../../hooks/diseaseHistory/useCreateDiseaseHistory";

export const DiseaseHistory = ({ patient_id, setIsOpen, onSuccess = () => {} }) => {
  const { data: diseaseParameters, isLoading: isLoadingDiseaseParameters } =
    useGetDiseaseParameters();
  const methods = useForm();
  const { mutate: createDiseaseHistory } = useCreateDiseaseHistory();

  const onSubmitCreate = async (data) => {
    createDiseaseHistory(
      {
        diseaseData: {
          id_paciente: patient_id,
          id_enfermedad: data.enfermedad?.value,
          fecha_diagnostico: data.fecha_diagnostico,
          observacion: data.observacion || null,
        },
      },
      {
        onSuccess: (data) => {
          setIsOpen();
          onSuccess(data);
        },
        onError: (error) => {
          toast.error(
            error.response?.data || "No se pudo registrar la enfermedad",
          );
        },
      },
    );
  };

  return (
    <div>
      {!isLoadingDiseaseParameters && (
        <form onSubmit={methods.handleSubmit(onSubmitCreate)}>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm font-semibold">
                Enfermedad<label className="text-red-600">*</label>
              </label>
              <Select
                options={diseaseParameters?.map((parameter) => ({
                  label: parameter.codigo_cie10
                    ? `${parameter.titulo} (${parameter.codigo_cie10})`
                    : parameter.titulo,
                  value: parameter.id,
                }))}
                className="rounded-lg"
                onChange={(value) => methods.setValue("enfermedad", value)}
                value={methods.watch("enfermedad")}
                required
              />
            </div>
            <Input
              name="fecha_diagnostico"
              label="Fecha de la enfermedad"
              methods={methods}
              type="date"
              required
            />
          </div>
          <div className="mt-2">
            <Input
              name="observacion"
              label="Observación"
              methods={methods}
              placeholder=""
              type="textarea"
            />
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
    </div>
  );
};
