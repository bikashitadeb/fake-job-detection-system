import { Card, CardContent, Typography } from "@mui/material";

const StatCard = ({ title, value, color }) => {
  return (
    <Card
      sx={{
        borderLeft: `6px solid ${color}`,
        height: "100%",
      }}
    >
      <CardContent>
        <Typography color="text.secondary" gutterBottom>
          {title}
        </Typography>

        <Typography variant="h4" fontWeight="bold">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StatCard;