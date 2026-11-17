import { useForm } from "react-hook-form";
import Select from "react-select";
import { toast } from "react-toastify";

// componentes
import { Input } from "../Form/Input";

// Queries
import { useGetSubstanceParameters } from "../../hooks/substanceHistory/useGetSubstanceParameters";
import { useCreateSubstanceHistory } from "../../hooks/substanceHistory/useCreateSubstanceHistory";

const TRIMESTRE_OPTIONS = [
  { label: "1er trimestre", value: 1 },
  { label: "2do trimestre", value: 2 },
  { label: "3er trimestre", value: 3 },
];

export const SubstanceHistory = ({ patient_id, setIsOpen, onSuccess = () => {} }) => {
  const { data: substanceParameters, isLoading: isLoadingSubstanceParameters } =
    useGetSubstanceParameters();
  const methods = useForm();
  const { mutate: createSubstanceHistory } = useCreateSubstanceHistory();

  const onSubmitCreate = async (data) => {
    createSubstanceHistory(
      {
        substanceData: {
          id_paciente: patient_id,
          id_sustancia: data.sustancia?.value,
          trimestre: data.trimestre?.value,
          notas: data.notas || null,
        },
      },
      {
        onSuccess: (data) => {
          setIsOpen();
          onSuccess(data);
        },
        onError: (error) => {
          toast.error(
            error.response?.data || "No se pudo registrar la sustancia",
          );
        },
      },
    );
  };

  return (
    <div>
      {!isLoadingSubstanceParameters && (
        <form onSubmit={methods.handleSubmit(onSubmitCreate)}>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm font-semibold">
                Sustancia<label className="text-red-600">*</label>
              </label>
              <Select
                options={substanceParameters?.map((parameter) => ({
                  label: parameter.nombre,
                  value: parameter.id_sustancia,
                }))}
                className="rounded-lg"
                onChange={(value) => methods.setValue("sustancia", value)}
                value={methods.watch("sustancia")}
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold">
                Trimestre<label className="text-red-600">*</label>
              </label>
              <Select
                options={TRIMESTRE_OPTIONS}
                className="rounded-lg"
                onChange={(value) => methods.setValue("trimestre", value)}
                value={methods.watch("trimestre")}
                required
              />
            </div>
          </div>
          <div className="mt-2">
            <Input
              name="notas"
              label="Notas"
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
