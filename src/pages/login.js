import { useState } from "react";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
    Box,
    Button,
    Container,
    Link,
    TextField,
    Typography,
    Alert,
} from "@mui/material";

import { useAuth } from "src/contexts/AuthUserContext";
import Image from "next/image";
import axios from 'axios';

const Login = () => {
    const { login } = useAuth();
    const router = useRouter();
    const [error, setError] = useState("");
    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email("Must be a valid email")
                .max(255)
                .required("Email is required"),
            password: Yup.string()
                .min(6, "Password must be at least 6 characters")
                .max(255)
                .required("Password is required"),
        }),
        onSubmit: (values, { setSubmitting }) => {
            login(values.email, values.password)
                .then(async (authUser) => {
                    // Success. The user is created in Firebase
                    await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/loggedIn?company=${authUser.companyId}`).then((res) => {
                      if (res.data.error) {
                          console.log(res.data.error);
                      }})
                    router.push("/");
                    
                })
                .catch(async (error) => {
                    // An error occurred. Set error message to be displayed to user
                    switch (error.code) {
                        default:
                            setError("Invalid email or password.");
                            break;
                    }
                    setSubmitting(false);
                });
        },
    });

    return (
        <>
            <Head>
                <title>Login | {process.env.NEXT_PUBLIC_PRODUCT_NAME}</title>
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
                                Sign in
                            </Typography>
                        </Box>

                        {error && <Alert severity="error">{error}</Alert>}

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
                            autoComplete="current-password"
                        />
                        <Box sx={{ py: 2 }}>
                            <Button
                                color="primary"
                                disabled={formik.isSubmitting}
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                            >
                                Sign In
                            </Button>
                        </Box>
                        <Box sx={{
                          display:'flex',
                          flexDirection:'row',
                          justifyContent:'space-between'
                        }}>
                          <Typography color="textSecondary" variant="body2">
                              Don&apos;t have an account?{" "}
                              <NextLink href="/register">
                                  <Link
                                      to="/register"
                                      variant="subtitle2"
                                      underline="hover"
                                      sx={{
                                          cursor: "pointer",
                                      }}
                                  >
                                      Sign Up
                                  </Link>
                              </NextLink>
                          </Typography>

                          <Typography color="textSecondary" variant="body2">
                              Forgot your password?{" "}
                              <NextLink href="/forgot_pass">
                                  <Link
                                      to="/forgot_pass"
                                      variant="subtitle2"
                                      underline="hover"
                                      sx={{
                                          cursor: "pointer",
                                      }}
                                  >
                                      Reset
                                  </Link>
                              </NextLink>
                          </Typography>
                        </Box>
                    </form>
                </Container>
            </Box>
        </>
    );
};

export default Login;
