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

const ForgotPass = () => {
  const { resetPassword } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const [reset, setReset] = useState(false);
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Must be a valid email")
        .max(255)
        .required("Email is required"),
    }),
    onSubmit: (values, { setSubmitting }) => {
      resetPassword(values.email);
      setReset(true);
      setSubmitting(false);
    },
  });

  return (
    <>
      <Head>
        <title>Forgot Password | {process.env.NEXT_PUBLIC_PRODUCT_NAME}</title>
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
                Forgot Password
              </Typography>
            </Box>

            {error && <Alert severity="error">{error}</Alert>}
            {reset ? (
              <>
                <Typography color="textSecondary" variant="h3" sx={{ mb: 1 }}>
                  Check your email for a link to reset your password.
                </Typography>
                <Typography color="textPrimary" variant="body1" sx={{ mb: 3 }}>
                  *Reminder to check your spam folder
                </Typography>
              </>
            ) : (
              <>
                <TextField
                  error={Boolean(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
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

                <Box sx={{ py: 2 }}>
                  <Button
                    color="primary"
                    disabled={formik.isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Recover Account
                  </Button>
                </Box>
              </>
            )}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Typography color="textSecondary" variant="body2">
                Already have an account?{" "}
                <NextLink href="/login">
                  <Link
                    to="/login"
                    variant="subtitle2"
                    underline="hover"
                    sx={{
                      cursor: "pointer",
                    }}
                  >
                    Sign In
                  </Link>
                </NextLink>
              </Typography>

              <Typography color="textSecondary" variant="body2">
                Need to create an account?{" "}
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
            </Box>
          </form>
        </Container>
      </Box>
    </>
  );
};

export default ForgotPass;
