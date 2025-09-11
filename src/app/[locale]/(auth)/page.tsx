
import SigninForm from '@/components/common/SigninForm'
import { getTranslations } from 'next-intl/server';

import React from 'react'

const SigninPage = async({searchParams}:{searchParams:Promise<{callbackUrl:string}>}) => {
  const {callbackUrl} = await searchParams;
  //  const t = await getTranslations('HomePage');
  return (
    <>
    {/* {t("title")} */}
    <SigninForm callbackUrl={callbackUrl ||"/dashboard"}/>
    </>
  )
}

export default SigninPage;
