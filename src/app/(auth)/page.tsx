
import SigninForm from '@/components/common/SigninForm'
import React from 'react'

const SigninPage = async({searchParams}:{searchParams:Promise<{callbackUrl:string}>}) => {
  const {callbackUrl} = await searchParams;
  return (
    <SigninForm callbackUrl={callbackUrl ||"/dashboard"}/>
  )
}

export default SigninPage;
