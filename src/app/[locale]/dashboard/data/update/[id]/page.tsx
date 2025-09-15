import React from 'react'
import UpdateForm from './components/UpdateForm';

const UpdatePage = async({params}:{params:Promise<{id:string}>}) => {
  const {id} =await params;
  return (
    <div>
      <UpdateForm id={id}/>
    </div>
  )
}

export default UpdatePage
