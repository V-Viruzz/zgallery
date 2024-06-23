import CardPlan from '@/components/CardPlan'
import React from 'react'

export default function page () {
  return (
    <section className='w-full grid grid-rows-[14rem_1fr] md:h-full md:grid-rows-[20rem_1fr]'>
      <div className='flex flex-col items-center justify-center'>
        <p className='md:w-[58%] w-[90%] text-center text-3xl'>
          Discover the perfect plan for you
        </p>
      </div>

      <div className='pb-10 flex flex-col items-center justify-center gap-6 md:flex-row md:justify-center md:gap-16'>

        <CardPlan
          title='Basic'
          price='Free'
          description='unlimited'
          features={[
            '2 gb storage ',
            'Access to all main features'
          ]}
          textButton='Start'
        />

        <CardPlan
          title='Premiun'
          price='$ 5 usd'
          description='Per month'
          features={[
            '2 gb storage ',
            'Access to all main features',
            'Change resolution'
          ]}
          textButton='Start'
        />

      </div>
    </section>
  )
}
