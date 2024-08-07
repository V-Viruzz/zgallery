import React from 'react'
import TilIcon from './icons/TilIcon'

interface Props {
  title: string
  price: string
  description: string
  features: string[]
  textButton: string
  handleClick: () => void
}

export default function CardPlan ({ title, price, description, features, textButton, handleClick }: Props) {
  return (
    <div className='h-96 w-[90%] sm:w-[70%] box-content border-2 rounded-3xl border-neutral-700 md:w-80'>
      <div className='w-full h-full p-8 flex flex-col'>
        <div>
          <div>
            <h2 className='text-tertiary text-2xl mb-4'>{title}</h2>
          </div>
          <div className='flex flex-col gap-3'>
            <h3 className='text-4xl'>{price}</h3>
            <p className='text-neutral-500'>{description}</p>
          </div>
        </div>

        <div className='mt-6'>
          <ul className='list-image-checkmark text-base  text-neutral-500 flex flex-col gap-3'>
            {
              features.map((feature) => (
                <li key={feature} className='flex items-center gap-2'>
                  <TilIcon />{feature}
                </li>
              ))
            }
          </ul>
        </div>

        <div className='h-full flex flex-col justify-end'>
          <button
            className='bg-tertiary w-full h-10 rounded-lg hover:bg-[#930b34] active:bg-[#76092a]'
            onClick={handleClick}
          >
            {textButton}
          </button>
        </div>
      </div>

    </div>
  )
}
