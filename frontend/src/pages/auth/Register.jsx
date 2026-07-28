import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Paper,
  TextField,
  Button,
  Typography,
  MenuItem,
} from "@mui/material";
import { toast } from "react-toastify";

import {
  registerUser,
  registerRecruiter,
} from "../../services/authService";

export default function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({

    name: "",

    email: "",

    password: "",

    role: "applicant",

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

      if (form.role === "recruiter") {

        await registerRecruiter(form);

      }

      else {

        await registerUser(form);

      }

      toast.success("Registration Successful");

      navigate("/login");

    }

    catch (err) {

      toast.error(

        err.response?.data?.message ||

        "Registration Failed"

      );

    }

  };

  return (

    <Paper

      elevation={4}

      sx={{

        width:450,

        margin:"40px auto",

        padding:4,

      }}

    >

      <Typography

        variant="h4"

        align="center"

        gutterBottom

      >

        Register

      </Typography>

      <form onSubmit={handleSubmit}>

        <TextField

          fullWidth

          margin="normal"

          label="Name"

          name="name"

          onChange={handleChange}

        />

        <TextField

          fullWidth

          margin="normal"

          label="Email"

          name="email"

          onChange={handleChange}

        />

        <TextField

          fullWidth

          margin="normal"

          type="password"

          label="Password"

          name="password"

          onChange={handleChange}

        />

        <TextField

          fullWidth

          select

          margin="normal"

          label="Role"

          name="role"

          value={form.role}

          onChange={handleChange}

        >

          <MenuItem value="applicant">

            Applicant

          </MenuItem>

          <MenuItem value="recruiter">

            Recruiter

          </MenuItem>

        </TextField>

        <Button

          variant="contained"

          fullWidth

          sx={{mt:2}}

          type="submit"

        >

          Register

        </Button>

      </form>

      <Typography

        align="center"

        sx={{mt:2}}

      >

        Already have an account?

        {" "}

        <Link to="/login">

          Login

        </Link>

      </Typography>

    </Paper>

  );

}