import React from 'react'
import Dropzone from 'react-dropzone'
import { CameraIcon } from '@heroicons/react/24/solid'

const DropzoneComponent = ({ setImage, image }) => {
    return (
        <Dropzone onDrop={acceptedFiles => setImage(acceptedFiles)}>
            {({getRootProps, getInputProps}) => (
                <section>
                <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    {
                        image?.length > 0 ? (
                            <div>
                                <img alt="product-image" src={`${typeof image !== 'string' ? URL.createObjectURL(image[0]) : image }`} className="h-[100px] w-[150px]" />
                            </div>
                        ): (
                            <div type="button" className=" flex justify-center text-center p-8 border border-dotted border-klintoRed h-full">
                            <CameraIcon className="h-8 w-8 text-red-300" />
                        </div>
                        )
                    }
                </div>
                </section>
            )}
        </Dropzone>
    )
}

export default DropzoneComponent;
