import React, { useEffect, useState } from "react";
import style from './Home.module.scss';
import Navbar from "../../components/Navbar";
import { Form, Formik, Field, FieldProps } from "formik";
import { TextField, Button, CircularProgress } from "@mui/material";
import * as Yup from 'yup';
import { toast } from "react-toastify";

interface Notified{
    name: string;
    email: string;
    telephone: string;
    address: string;
}

interface NotificationBase{
    title: string;
    description: string;
    audience: string;
}

interface NotificationForm extends NotificationBase{
    time: string;
}

interface Notification extends NotificationBase{
    id: number;
    status: string;
    notified: Notified | null;
}

export default function Notificacoes() {
    const [ notifications, setNotifications ] = useState<Notification[]>([]);
    const [ loading, setLoading ] = useState(false);
    const [ poupupNotification, setPoupupNotification ] = useState(false);
    const [ poupupNotified, setPoupupNotified ] = useState(false);
    const initialValues: NotificationForm = {
        title: "",
        audience: "",
        description: "",
        time: "",
    };
    const validationSchema = Yup.object({
        title: Yup.string().required("Título é obrigatório"),
        audience: Yup.date().required("Data da audiência é obrigatória").min(new Date(), "A data da audiência não pode ser no passado"),
        time: Yup.string().required("Hora da audiência é obrigatória"),
        description: Yup.string().required("Descrição é obrigatória"),
    });

    const createNotification = async(values: NotificationForm) => {
        setLoading(true);
        try{
            const audienceDateTime = new Date(`${values.audience}T${values.time}`);
            const payload = {
                title: values.title,
                description: values.description,
                audience: audienceDateTime.toISOString(),
            };

            const response = await fetch("http://localhost:8000/api/notifications/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            if(response.ok){
                toast.success("Notificação criada com sucesso!");
            }else{
                toast.error("Ocorreu um erro ao criar a notificação!");
            }
        }catch{
            toast.error("Ocorreu um erro ao criar a notificação!");
        }finally{
            setLoading(false);
            setPoupupNotification(false);
        }
    }

    useEffect(() => {
        const getNotifications = async() => {
            setLoading(true);
            setNotifications([]);
            try{
                const response = await fetch("http://localhost:8000/api/notifications/");
                if(response.ok){
                    const data = await response.json();
                    setNotifications(data);
                }else{
                    toast.error("Ocorreu um erro ao buscar as notificações!");
                }
            }catch{}finally{
                setLoading(false);
            }
        }

        getNotifications();
    }, []);

    return (
        <>
            {poupupNotification ?
                <div className={style.poupupNotification}>
                    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={createNotification}>
                        {({ isValid, dirty, errors, touched }) => (
                            <Form>
                                <p className={style.title}>Nova notificação</p>
                                <Field name="title">
                                    {({ field, meta }: FieldProps) => (
                                        <TextField
                                            {...field}
                                            label="Título"
                                            variant="outlined"
                                            fullWidth
                                            margin="normal"
                                            error={meta.touched && Boolean(meta.error)}
                                            helperText={meta.touched && meta.error}
                                        />
                                    )}
                                </Field>
                                <Field name="audience">
                                    {({ field, meta }: FieldProps) => (
                                        <TextField
                                            {...field}
                                            label="Data da audiência"
                                            type="date"
                                            variant="outlined"
                                            fullWidth
                                            margin="normal"
                                            InputLabelProps={{ shrink: true }}
                                            error={meta.touched && Boolean(meta.error)}
                                            helperText={meta.touched && meta.error}
                                        />
                                    )}
                                </Field>
                                <Field name="time">
                                    {({ field }: any) => (
                                        <TextField
                                            {...field}
                                            type="time"
                                            label="Hora da audiência"
                                            fullWidth
                                            InputLabelProps={{ shrink: true }}
                                            error={Boolean(field.value && errors.time)}
                                        />
                                    )}
                                </Field>
                                <Field name="description">
                                    {({ field, meta }: FieldProps) => (
                                        <TextField
                                            {...field}
                                            label="Descrição"
                                            multiline
                                            rows={4}
                                            variant="outlined"
                                            fullWidth
                                            margin="normal"
                                            error={meta.touched && Boolean(meta.error)}
                                            helperText={meta.touched && meta.error}
                                        />
                                    )}
                                </Field>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={loading || !isValid || !dirty}
                                    fullWidth
                                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                                >
                                    {loading ? "Criando..." : "Criar Notificação"}
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </div>
                : null
            }
            {poupupNotified ?
                <div className={style.poupupNotified}>
                </div>
                : null
            }
            <div className={style.notifications}>
                <Navbar/>
                <div className={style.intern}>
                    <p className={style.title}>Notificações Judiciais</p>
                    <div className={style.actions}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ mt: 2 }}
                            onClick={() => setPoupupNotification(true)}
                        >
                            Criar Notificação
                        </Button>
                    </div>
                    <div className={style.table}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>E-mail</th>
                                    <th>Telefone</th>
                                    <th>Endereço</th>
                                    <th>Titúlo</th>
                                    <th>Descrição</th>
                                    <th>Data da audiência</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {notifications.map((notification, index) => (
                                    <tr key={index}>
                                        <td>{notification.notified ? notification.notified.name : '- - -'}</td>
                                        <td>{notification.notified ? notification.notified.email : '- - -'}</td>
                                        <td>{notification.notified ? notification.notified.telephone: '- - -'}</td>
                                        <td>{notification.notified ? notification.notified.address : '- - -'}</td>
                                        <td>{notification.title}</td>
                                        <td>{notification.description}</td>
                                        <td>{notification.audience}</td>
                                        <td>{notification.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
