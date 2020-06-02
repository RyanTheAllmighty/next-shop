FROM node:12

# Avoid warnings by switching to noninteractive
ENV DEBIAN_FRONTEND=noninteractive

# This Dockerfile adds a non-root 'vscode' user with sudo access. However, for Linux,
# this user's GID/UID must match your local user UID/GID to avoid permission issues
# with bind mounts. Update USER_UID / USER_GID if yours is not 1000. See
# https://aka.ms/vscode-remote/containers/non-root-user for details.
ARG USERNAME=vscode
ARG USER_UID=1001
ARG USER_GID=$USER_UID

# Install Redis from: https://hub.docker.com/_/redis
COPY --from=redis:5 /usr/local/bin/redis-cli /usr/local/bin/redis-cli

# Configure apt and install packages
RUN apt-get update \
    && apt-get -y install --no-install-recommends apt-utils dialog \
    #
    # System packages
    && apt-get -y install curl git gnupg lsb-release openssl procps sudo unzip vim zip \
    #
    # Create a non-root user to use if preferred - see https://aka.ms/vscode-remote/containers/non-root-user.
    && groupadd --gid $USER_GID $USERNAME \
    && useradd -s /bin/bash --uid $USER_UID --gid $USER_GID -m $USERNAME \
    #
    # Add sudo support for the non-root user
    && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME\
    && chmod 0440 /etc/sudoers.d/$USERNAME \
    #
    # Make the extensions directory for the VSCode server
    && mkdir -p /home/$USERNAME/.vscode-server/extensions \
    && chown -R $USERNAME:$USERNAME /home/$USERNAME/.vscode-server \
    #
    # Make the extensions needed for GPG agent forwarding
    && mkdir -p /home/$USERNAME/.gnupg \
    && chown -R $USERNAME:$USERNAME /home/$USERNAME/.gnupg \
    && mkdir -p /home/$USERNAME/.gnupg-localhost \
    && chown -R $USERNAME:$USERNAME /home/$USERNAME/.gnupg-localhost \
    #
    # Clean up
    && apt-get autoremove -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

ADD postCreate.sh /opt/postCreate.sh
RUN chmod a+x /opt/postCreate.sh

# Switch back to dialog for any ad-hoc use of apt-get
ENV DEBIAN_FRONTEND=

USER $USERNAME
