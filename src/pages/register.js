import { useState } from "react";
import Head from "next/head";
import NextLink from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import {
    Box,
    Button,
    Checkbox,
    Container,
    FormHelperText,
    Link,
    TextField,
    Typography,
    Alert,
} from "@mui/material";

import { useAuth } from "../contexts/AuthUserContext";

const Register = () => {
    const { register } = useAuth();
    const router = useRouter();
    const [error, setError] = useState("");
    const formik = useFormik({
        initialValues: {
            companyName: "",
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            passwordRepeat: "",
            policy: false,
        },
        validationSchema: Yup.object({
            companyName: Yup.string()
                .max(255)
                .required("Company name is required"),
            firstName: Yup.string().max(255).required("First name is required"),
            lastName: Yup.string().max(255).required("Last name is required"),
            email: Yup.string()
                .email("Must be a valid email")
                .max(255)
                .required("Email is required"),
            password: Yup.string()
                .min(6, "Password must be at least 6 characters")
                .max(255)
                .required("Password is required"),
            // passwordRepeat: Yup.string()
            //     .max(255)
            //     .required("Confirm password is required"),
            policy: Yup.boolean().oneOf([true], "This field must be checked"),
        }),
        onSubmit: (values, { setSubmitting }) => {
            axios({
                method: "post",
                url: `${process.env.NEXT_PUBLIC_API_URL}/user`,
                data: {
                    company_id: "1",
                    email: values.email,
                    first_name: values.firstName,
                    last_name: values.lastName,
                },
            })
                .then(function (response) {
                    register(values.email, values.password)
                        .then((authUser) => {
                            // Success. The user is created in Firebase
                            router.push("/upload");
                        })
                        .catch((error) => {
                            // An error occurred. Set error message to be displayed to user
                            switch (error.code) {
                                case "auth/email-already-in-use":
                                    setError(
                                        "An account already exists with this email address, Sign In instead."
                                    );
                                    break;
                                default:
                                    setError(
                                        "An error occurred, please try again later."
                                    );
                                    break;
                            }
                            setSubmitting(false);
                        });
                })
                .catch(function (error) {
                    setError("An error occurred, please try again later.");
                });
        },
    });

    return (
        <>
            <Head>
                <title>Register | {process.env.NEXT_PUBLIC_PRODUCT_NAME}</title>
            </Head>
            <Box
                component="main"
                sx={{
                    alignItems: "center",
                    display: "flex",
                    flexGrow: 1,
                    minHeight: "100%",
                }}
            >
                <Container maxWidth="sm" sx={{ my: 3 }}>
                    <form onSubmit={formik.handleSubmit}>
                        <Image
                            src="/static/images/ArcumLogo.png"
                            alt="Arcum AI logo"
                            height={50}
                            width={143}
                        />
                        <Box sx={{ my: 3 }}>
                            <Typography color="textPrimary" variant="h4">
                                Create a new account
                            </Typography>
                            {/* <Typography
                                color="textSecondary"
                                gutterBottom
                                variant="body2"
                            >
                                Use your email to create a new account
                            </Typography> */}
                        </Box>

                        {error && <Alert severity="error">{error}</Alert>}

                        <TextField
                            error={Boolean(
                                formik.touched.companyName &&
                                    formik.errors.companyName
                            )}
                            fullWidth
                            helperText={
                                formik.touched.companyName &&
                                formik.errors.companyName
                            }
                            label="Company Name"
                            margin="normal"
                            name="companyName"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.companyName}
                            variant="outlined"
                            autoComplete="organization"
                        />
                        <TextField
                            error={Boolean(
                                formik.touched.firstName &&
                                    formik.errors.firstName
                            )}
                            fullWidth
                            helperText={
                                formik.touched.firstName &&
                                formik.errors.firstName
                            }
                            label="First Name"
                            margin="normal"
                            name="firstName"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.firstName}
                            variant="outlined"
                            autoComplete="given-name"
                        />
                        <TextField
                            error={Boolean(
                                formik.touched.lastName &&
                                    formik.errors.lastName
                            )}
                            fullWidth
                            helperText={
                                formik.touched.lastName &&
                                formik.errors.lastName
                            }
                            label="Last Name"
                            margin="normal"
                            name="lastName"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.lastName}
                            variant="outlined"
                            autoComplete="family-name"
                        />
                        <TextField
                            error={Boolean(
                                formik.touched.email && formik.errors.email
                            )}
                            fullWidth
                            helperText={
                                formik.touched.email && formik.errors.email
                            }
                            label="Email Address"
                            margin="normal"
                            name="email"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            type="email"
                            value={formik.values.email}
                            variant="outlined"
                            autoComplete="email"
                        />
                        <TextField
                            error={Boolean(
                                formik.touched.password &&
                                    formik.errors.password
                            )}
                            fullWidth
                            helperText={
                                formik.touched.password &&
                                formik.errors.password
                            }
                            label="Password"
                            margin="normal"
                            name="password"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            type="password"
                            value={formik.values.password}
                            variant="outlined"
                            autoComplete="new-password"
                        />
                        {/* <TextField
                            error={Boolean(
                                formik.touched.passwordRepeat &&
                                    formik.errors.passwordRepeat
                            )}
                            fullWidth
                            helperText={
                                formik.touched.passwordRepeat &&
                                formik.errors.passwordRepeat
                            }
                            label="Confirm Password"
                            margin="normal"
                            name="passwordRepeat"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            type="password"
                            value={formik.values.passwordRepeat}
                            variant="outlined"
                            validate={passwordRepeat}
                        /> */}
                        <Box
                            sx={{
                                alignItems: "center",
                                display: "flex",
                                ml: -1,
                            }}
                        >
                            <Checkbox
                                checked={formik.values.policy}
                                name="policy"
                                onChange={formik.handleChange}
                            />
                            <Typography color="textSecondary" variant="body2">
                                I have read the{" "}
                                <NextLink href="#" passHref>
                                    <Link
                                        color="primary"
                                        underline="always"
                                        variant="subtitle2"
                                    >
                                        Terms and Conditions
                                    </Link>
                                </NextLink>
                            </Typography>
                        </Box>
                        {Boolean(
                            formik.touched.policy && formik.errors.policy
                        ) && (
                            <FormHelperText error>
                                {formik.errors.policy}
                            </FormHelperText>
                        )}
                        <Box sx={{ py: 2 }}>
                            <Button
                                color="primary"
                                disabled={formik.isSubmitting}
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                            >
                                Sign Up
                            </Button>
                        </Box>
                        <Typography color="textSecondary" variant="body2">
                            Have an account?{" "}
                            <NextLink href="/login" passHref>
                                <Link variant="subtitle2" underline="hover">
                                    Sign In
                                </Link>
                            </NextLink>
                        </Typography>
                    </form>
                </Container>
            </Box>
        </>
    );
};

export default Register;
