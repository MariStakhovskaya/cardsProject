import React from 'react';
import {useFormik} from 'formik';
import {useDispatch, useSelector} from 'react-redux';
import {Redirect} from 'react-router-dom';
import {AppRootState} from '../../app/store';
import SuperInputText from '../../components/common/c1-SuperInputText/SuperInputText';
import SuperButton from '../../components/common/c2-SuperButton/SuperButton';
import {RoutePath} from '../../components/main/main';
import {RequestStatusType} from '../../app/app-reducer';
import {Preloader} from '../../components/common/preloader/Preloader';
import {signUp} from "./registration-reducer";
import {checkPasswordValidation, emailValidation, passwordValidation} from "../../components/common/utills/Validation";
import c from '../../components/common/commonStyle/commonStyle.module.css'


export const Registration = () => {
    const dispatch = useDispatch()
    const isLoading = useSelector<AppRootState, RequestStatusType>(state => state.app.status)
    type FormErrorType = {
        email?: string
        password?: string
        checkPassword?: string
    }
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            checkPassword: '',
        },
        validate: (values) => {
            const errors: FormErrorType = {};
            const errorPass = passwordValidation(values, errors.password)
            errorPass && (errors.password = errorPass)
            const errorEmail = emailValidation(values, errors.email)
            errorEmail && (errors.email = errorEmail)
            const checkPassError = checkPasswordValidation(values, errors.checkPassword)
            checkPassError && (errors.checkPassword = checkPassError)
            return errors;
        },
        onSubmit: values => {
            formik.resetForm()
            dispatch(signUp({email:values.email, password: values.password}))
        },
    })



    if (isLoading === 'succeeded') {
        return <Redirect to={RoutePath.LOGIN} />
    }

    return (
        <div className={c.wrap}>
            <form onSubmit={formik.handleSubmit} className={c.formBlock}>
                <div>
                    <h3>Registration</h3>
                </div>
                <SuperInputText
                    placeholder={'Email'}
                    {...formik.getFieldProps('email')}
                />
                {formik.touched.email &&
                formik.errors.email ? <div style={{color: 'red'}}>{formik.errors.email}</div> : null}
                <SuperInputText
                    type={'password'}
                    placeholder={'Password'}
                    {...formik.getFieldProps('password')}
                />
                {formik.touched.password &&
                formik.errors.password ? <div style={{color: 'red'}}>{formik.errors.password}</div> : null}
                <SuperInputText
                    type={'password'}
                    placeholder={'Password'}
                    {...formik.getFieldProps('checkPassword')}
                />
                {formik.touched.checkPassword &&
                    formik.errors.checkPassword ? <div style={{ color: 'red' }}>{formik.errors.checkPassword}</div> : null}
                <div>
                    {isLoading === 'loading' ? <Preloader /> : <SuperButton type={'submit'} title={'sign up'} />}
                </div>

            </form>
        </div>
    )
}
