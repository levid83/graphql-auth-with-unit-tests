import { useForm } from "react-hook-form";

const AuthForm = ({ onSubmit, children }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  return (
    <form className="form-signin" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-3" style={{ paddingBottom: 5 }}>
        <label htmlFor="inputEmail">Email address</label>
        <input
          name="email"
          type="email"
          id="inputEmail"
          data-testid="email"
          className="form-control"
          required
          autoFocus
          {...register("email")}
        />
        {errors.email && <p>{errors.email}</p>}
      </div>

      <div className="mb-3" style={{ paddingBottom: 5 }}>
        <label htmlFor="inputPassword">Password</label>
        <input
          name="password"
          type="password"
          id="inputPassword"
          data-testid="password"
          className="form-control"
          required
          {...register("password")}
        />
        {errors.password && <p>{errors.password}</p>}
      </div>
      <button
        className="btn btn-lg btn-primary btn-block"
        type="submit"
        data-testid="submit"
      >
        {children}
      </button>
    </form>
  );
};

export default AuthForm;
