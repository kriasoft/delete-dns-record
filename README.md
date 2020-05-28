# Delete DNS Record Action for GitHub

Deletes CloudFlare DNS record by ID or record name.

## Usage via Github Actions

```yaml
name: example
on:
  pull_request:
    type: [closed]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: infraway/delete-dns-record@v1
        with:
          name: "review.example.com"
          token: ${{ secrets.CLOUDFLARE_TOKEN }}
          zone: ${{ secrets.CLOUDFLARE_ZONE }}
```

## Usage via docker image

```shell script
docker run -it --rm \
  -e "INPUT_TOKEN=1" \
  -e "INPUT_ZONE=2" \
  -e "INPUT_NAME=review.example.com" \
  infraway/cloudflare-delete-dns-record 
```

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE).
