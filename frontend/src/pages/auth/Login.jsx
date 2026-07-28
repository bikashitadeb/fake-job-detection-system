import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { TextField, Button, Paper, Typography } from "@mui/material";
import { toast } from "react-toastify";

import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

export default function Login() {

  const navigate = useNavigate();

  const { login } = useAuth();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]: e.target.value,

    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const response = await loginUser(form);

      const token = response.data.access_token;

      const role = response.data.user.role;

      login(token, role);

      toast.success("Login Successful");

      if (role === "admin") {

        navigate("/admin");

      }

      else if (role === "recruiter") {

        navigate("/recruiter");

      }

      else {

        navigate("/jobs");

      }

    }

    catch (err) {

      toast.error(

        err.response?.data?.message ||

        "Login Failed"

      );

    }

    finally {

      setLoading(false);

    }

  };

  return (

    <Paper

      elevation={4}

      sx={{

        width:400,

        margin:"60px auto",

        padding:4,

      }}

    >

      <Typography

        variant="h4"

        align="center"

        gutterBottom

      >

        Login

      </Typography>

      <form onSubmit={handleSubmit}>

        <TextField

          fullWidth

          margin="normal"

          label="Email"

          name="email"

          value={form.email}

          onChange={handleChange}

        />

        <TextField

          fullWidth

          margin="normal"

          label="Password"

          type="password"

          name="password"

          value={form.password}

          onChange={handleChange}

        />

        <Button

          fullWidth

          sx={{mt:2}}

          variant="contained"

          type="submit"

          disabled={loading}

        >

          {loading ? "Logging In..." : "Login"}

        </Button>

      </form>

      <Typography

        sx={{mt:2}}

        align="center"

      >

        Don't have an account?

        {" "}

        <Link to="/register">

          Register

        </Link>

      </Typography>

    </Paper>

  );

}