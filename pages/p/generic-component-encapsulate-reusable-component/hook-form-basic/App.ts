const app = `import { useForm } from 'react-hook-form';

type Pet = 'Cat' | 'Dog';
type FormData = {
  firstName: string;
  lastName: string;
  favorite: Pet;
};

export default function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const onSubmit = handleSubmit((data) => console.log(data));

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="firstname">First name:</label>
          <input type="text" id="firstname" {...register('firstName')} />
        </div>

        <div>
          <label htmlFor="lastname">Last name:</label>
          <input type="text" id="lastname" {...register('lastName')} />
        </div>

        <div>
          <label htmlFor="favorite">Favorite pet:</label>
          <select id="favorite" {...register('favorite')}>
            <option value="cat">Cat</option>
            <option value="dog">Dog</option>
          </select>
        </div>

        <button>Submit</button>
      </form>
    </div>
  );
}`;
export default app;
