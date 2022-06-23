# Mobius API

## Usage

With httpie:

```sh
$ https --body mobius.hasundue.workers.dev/create
https://mobius.hasundue.workers.dev/xxxx-xxxx-xxxx-xxxx
```

## Tech Stacks

- Clouflare Workers
- Denoflare

## Deploy

Clone the repository:

```sh
git clone https://github.com/hasundue/mobius.git
```

And deploy with Denoflare!

```sh
denoflare push mobius
```
