# Delete DNS Record Action for GitHub

Deletes CloudFlare DNS record by ID or record name.

## Usage

```yaml
name: example
on:
  pull_request:
    type: [closed]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: kriasoft/delete-dns-record@v1
        with:
          name: "{PR}-review.example.com"
          token: ${{ secrets.CLOUDFLARE_TOKEN }}
          zone: ${{ secrets.CLOUDFLARE_ZONE }}
```

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE).
