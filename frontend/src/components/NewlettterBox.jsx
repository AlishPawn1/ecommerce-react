import React from 'react'

const NewlettterBox = () => {
    const onSubmitHandler = (e)=> {
        e.preventDefult();
    }

  return (
    <section className='newletter-secction my-10'>
        <div className='container'>
            <div className='text-center'>
                <h2 className='text-2xl font-medium text-gray-800'>Subscribe now & get 20% off</h2>
                <p className='text-gray-400 mt-3'>This is the dummy text</p>
                <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3'>
                    <input className='w-full sm:flex-1 outline-none' type='email' placeholder='Enter your email' required/>
                    <button type='submit' className='bg-black text-white text-xs px-10 py-4 uppercasse cursor-pointer uppercase'>Subscribe</button>
                </form>
            </div>
        </div>
    </section>
  )
}

export default NewlettterBox
