import {
    Box,
    Card,
    CardContent,
    Divider,
    Grid,
    Typography,
} from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

const StatsCard = ({
    title,
    stat = false,
    chart = false,
    percentDecimal,
    children,
    ...cardProps
}) => (
    <Card {...cardProps}>
        <CardContent>
            <Grid
                container
                spacing={3}
                sx={{ justifyContent: "space-between" }}
            >
                <Grid item xs={12}>
                    <Typography
                        color="textSecondary"
                        gutterBottom
                        variant="overline"
                    >
                        {title}
                    </Typography>
                    {chart && <div>{children}</div>}
                    {stat && (
                        <Typography color="textPrimary" variant="h4">
                            {stat}
                        </Typography>
                    )}
                </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                }}
            >
                {/* Cards with chart usually have opposite semantic meaning for positive numbers */}
                {percentDecimal <= 0 ? (
                    <ArrowDownwardIcon color={chart ? "error" : "success"} />
                ) : (
                    <ArrowUpwardIcon color={chart ? "success" : "error"} />
                )}
                <Typography
                    color={
                        percentDecimal <= 0
                            ? chart
                                ? "error.main"
                                : "success.main"
                            : chart
                            ? "success.main"
                            : "error.main"
                    }
                    sx={{
                        mr: 1,
                    }}
                    variant="body2"
                >
                    {(Math.abs(percentDecimal) * 100).toFixed(0)}%
                </Typography>
                <Typography color="textSecondary" variant="caption">
                    Since last month
                </Typography>
            </Box>
        </CardContent>
    </Card>
);

export default StatsCard;
