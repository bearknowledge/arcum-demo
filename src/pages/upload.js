import { useContext, useState } from "react";
import Head from "next/head";
import { Box, Button, Card, Container, Typography } from "@mui/material";
import { DashboardLayout } from "../components/dashboard-layout";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ProtectedRoute from "src/components/ProtectedRoute";
import { styled } from "@mui/material/styles";
import Lottie from "lottie-react";

import processingAnimation from "../../public/static/animations/89769-folder-upload.json";
import { DataContext } from "src/contexts/DataContext";

const UploadContainer = styled("div")(({ theme }) => ({
    width: 500,
    height: 500,
    marginLeft: "auto",
    marginRight: "auto",
}));

const FileTypeIcon = styled("img")(({ theme }) => ({
    height: 50,
    marginLeft: "10px",
    marginRight: "10px",
}));

const FileTypeText = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.label,
    margin: "20px 0px 30px 0px",
}));

const Upload = () => {
    const [file, setFile] = useState(null);
    const { uploadCount, setUploadCount } = useContext(DataContext);

    const handleChange = (event) => {
        const fileUploaded = event.target.files[0];
        setFile(fileUploaded);
        setUploadCount(uploadCount + 1);
    };

    return (
        <>
            <Head>
                <title>
                    Dashboard | {process.env.NEXT_PUBLIC_PRODUCT_NAME}
                </title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    pb: 8,
                }}
            >
                <Container maxWidth={false}>
                    <Typography variant="h3" sx={{ mb: "27px" }}>
                        Upload Data
                    </Typography>
                    <UploadContainer>
                        {file ? (
                            <>
                                <Typography
                                    variant="h4"
                                    textAlign="center"
                                    sx={{ mb: 3 }}
                                >
                                    Processing in progress...
                                </Typography>
                                <Typography textAlign="center" sx={{ mb: 3 }}>
                                    {file.name}
                                </Typography>
                                <Lottie
                                    animationData={processingAnimation}
                                    style={{ height: 200 }}
                                    loop
                                />
                            </>
                        ) : (
                            <>
                                <Typography
                                    variant="h6"
                                    sx={{ mb: "20px" }}
                                    textAlign="center"
                                >
                                    Upload your file{" "}
                                    {uploadCount === 1 && "for June 2022"}
                                </Typography>
                                <Card>
                                    <img
                                        src="/static/images/uploadGraphic.png"
                                        width={300}
                                        style={{
                                            display: "block",
                                            marginLeft: "auto",
                                            marginRight: "auto",
                                            marginBottom: 50,
                                            marginTop: 20,
                                        }}
                                    ></img>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <FileTypeIcon src="/static/images/icons/xlsx-file-format-extension.png" />
                                        <FileTypeIcon src="/static/images/icons/csv-file-format-extension.png" />
                                    </div>
                                    <FileTypeText textAlign={"center"}>
                                        and other similar file types
                                    </FileTypeText>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            marginTop: 15,
                                            marginBottom: 25,
                                        }}
                                    >
                                        <input
                                            style={{ display: "none" }}
                                            id="contained-button-file"
                                            type="file"
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="contained-button-file">
                                            <Button
                                                variant="contained"
                                                startIcon={<FileUploadIcon />}
                                                component="span"
                                            >
                                                Select File
                                            </Button>
                                        </label>
                                    </div>
                                </Card>
                            </>
                        )}
                    </UploadContainer>
                </Container>
            </Box>
        </>
    );
};

Upload.getLayout = (page) => (
    <ProtectedRoute>
        <DashboardLayout>{page}</DashboardLayout>
    </ProtectedRoute>
);

export default Upload;
