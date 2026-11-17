import React, { useEffect, useState } from "react";

// Hooks
import { useForm } from "react-hook-form";

//componentes
import Select from "react-select";
import { Input } from "../Form/Input";
import Loader from "../Loader/Loader";

// Helpers
import {
  formatTelefono,
  mostrarTelefono,
  soloDigitos,
  PATRON_TELEFONO,
} from "../../helpers/phone";

// Queries
import { useGetHospitals } from "../../hooks/hospitals/useGetHospital";
import { useCreatePatient } from "../../hooks/useCreatePatient";
import { useGetDistricts } from "../../hooks/districts/useGetDistricts";
import { useGetPatientById } from "../../hooks/useGetPatients";
import { useUpdatePatientById } from "../../hooks/useUpdatePatient";

export const AddPatient = ({ isEditing, setIsOpen, onSuccess = () => {} }) => {
  const { data } = useGetPatientById({ patient_id: isEditing });
  const methods = useForm();

  const { data: hospitals } = useGetHospitals();
  const { data: districts } = useGetDistricts();

  const { mutate: createPatient } = useCreatePatient();
  const { mutate: updatePatient } = useUpdatePatientById({
    patient_id: isEditing,
  });

  const onSubmitCreate = async (data) => {
    if (isEditing) {
      updatePatient(
        {
          patient_id: isEditing,
          patientData: {
            primer_nombre: data.nombres.split(" ")[0],
            segundo_nombre: data.nombres.split(" ")[1] || "",
            tercer_nombre: data.nombres.split(" ")[2] || "",
            primer_apellido: data.apellidos.split(" ")[0],
            segundo_apellido: data.apellidos.split(" ")[1] || "",
            tercer_apellido: data.apellidos.split(" ")[2] || "",
            fecha_nacimiento: data.fecha_nacimiento,
            sexo: data.sexo.value,
            numero_contacto: soloDigitos(data.numero_contacto),
            distrito: data.distrito.value,
            direccion: data.direccion,
            hospital_nacimiento: data.hospital_nacimiento.value,
            nombres_padre: data.nombres_padre,
            nombres_madre: data.nombres_madre,
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
      createPatient(
        {
          patientData: {
            primer_nombre: data.nombres.split(" ")[0],
            segundo_nombre: data.nombres.split(" ")[1] || "",
            tercer_nombre: data.nombres.split(" ")[2] || "",
            primer_apellido: data.apellidos.split(" ")[0],
            segundo_apellido: data.apellidos.split(" ")[1] || "",
            tercer_apellido: data.apellidos.split(" ")[2] || "",
            fecha_nacimiento: data.fecha_nacimiento,
            sexo: data.sexo.value,
            numero_contacto: soloDigitos(data.numero_contacto),
            distrito: data.distrito.value,
            direccion: data.direccion,
            hospital_nacimiento: data.hospital_nacimiento.value,
            nombres_padre: data.nombres_padre,
            nombres_madre: data.nombres_madre,
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

  const { reset } = methods;

  useEffect(() => {
    if (data) {
      reset({
        ...data,
        nombres: [data.primer_nombre, data.segundo_nombre, data.tercer_nombre]
          .filter(Boolean)
          .join(" "),
        apellidos: [
          data.primer_apellido,
          data.segundo_apellido,
          data.tercer_apellido,
        ]
          .filter(Boolean)
          .join(" "),
        // Un número antiguo que no tiene 8 dígitos se carga tal cual, para que
        // el formulario pida corregirlo en lugar de recortarlo sin avisar.
        numero_contacto: mostrarTelefono(data.numero_contacto) ?? "",
        hospital_nacimiento:
          {
            label: data.hospital_nacimiento.nombre,
            value: data.hospital_nacimiento?.id,
          } || null,
        distrito:
          { label: data.distrito?.nombre, value: data.distrito?.id } || null,
        sexo:
          {
            label: data.sexo == "M" ? "Masculino" : "Femenino",
            value: data.sexo,
          } || null,
      });
    }
  }, [data, reset]);
  return (
    <div>
      <>
        <form onSubmit={methods.handleSubmit(onSubmitCreate)}>
          <div className="grid grid-cols-2 gap-2">
            <Input
              name="nombres"
              label="Nombres"
              methods={methods}
              placeholder=""
              type="text"
              required
            />
            <Input
              name="apellidos"
              label="Apellidos"
              methods={methods}
              placeholder=""
              type="text"
              required
            />
            <Input
              name="fecha_nacimiento"
              label="Fecha de nacimiento"
              methods={methods}
              type="date"
            />
            <div>
              <label className="text-sm font-semibold">
                Sexo<label className="text-red-600">*</label>
              </label>
              <Select
                options={[
                  { label: "Masculino", value: "M" },
                  { label: "Femenino", value: "F" },
                ]}
                className="rounded-lg"
                onChange={(e) => {
                  methods.setValue("sexo", e);
                }}
                value={methods.watch("sexo")}
                required
              />
            </div>
            <Input
              name="numero_contacto"
              label="Número de contacto"
              methods={methods}
              type="tel"
              inputMode="numeric"
              placeholder="0000-0000"
              maxLength={9}
              pattern={PATRON_TELEFONO}
              title="El número debe tener 8 dígitos, por ejemplo 7768-6881"
              registerOptions={{
                onChange: (e) =>
                  methods.setValue(
                    "numero_contacto",
                    formatTelefono(e.target.value),
                  ),
              }}
            />
            <div>
              <label className="text-sm font-semibold">
                Hospital de nacimiento<label className="text-red-600">*</label>
              </label>
              <Select
                options={hospitals?.map((hospital) => {
                  return {
                    label: hospital.nombre,
                    value: hospital.id_hospital,
                  };
                })}
                className="rounded-lg"
                onChange={(e) => {
                  methods.setValue("hospital_nacimiento", e);
                }}
                value={methods.watch("hospital_nacimiento")}
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold">
                Distrito<label className="text-red-600">*</label>
              </label>
              <Select
                options={districts?.map((district) => {
                  return {
                    label: district.nombre,
                    value: district.id_distrito,
                  };
                })}
                className="rounded-lg"
                onChange={(e) => {
                  methods.setValue("distrito", e);
                }}
                value={methods.watch("distrito")}
                required
              />
            </div>
            <Input
              name="direccion"
              label="Dirección"
              methods={methods}
              type="textarea"
            />
            <Input
              name="nombres_padre"
              label="Nombres del padre"
              methods={methods}
              placeholder=""
              type="text"
              required
            />
            <Input
              name="nombres_madre"
              label="Nombres de la madre"
              methods={methods}
              placeholder=""
              type="text"
              required
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
      </>
    </div>
  );
};
