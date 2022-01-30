```bash
pscale branch create blog dev
pscale connect blog dev --port 3309
npx prisma db push
pscale branch promote blog main
pscale deploy-request create blog dev
pscale deploy-request deploy blog 2
pscale deploy-request list blog
```
